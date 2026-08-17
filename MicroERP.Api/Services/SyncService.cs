using Microsoft.EntityFrameworkCore;
using MicroERP.Api.Data;
using MicroERP.Api.DTOs;
using MicroERP.Api.Enums;
using MicroERP.Api.Models;
using MicroERP.Api.Repositories.Interfaces;
using MicroERP.Api.Services.Exceptions;
using MicroERP.Api.Services.Interfaces;

namespace MicroERP.Api.Services;

public sealed class SyncService : ISyncService
{
    private readonly AppDbContext _dbContext;
    private readonly IClienteService _clienteService;
    private readonly IClienteRepository _clienteRepository;
    private readonly IProdutoRepository _produtoRepository;
    private readonly IServicoRepository _servicoRepository;
    private readonly IAtendimentoRepository _atendimentoRepository;
    private readonly IItemProdutoRepository _itemProdutoRepository;
    private readonly IItemServicoRepository _itemServicoRepository;

    public SyncService(
        AppDbContext dbContext,
        IClienteService clienteService,
        IClienteRepository clienteRepository,
        IProdutoRepository produtoRepository,
        IServicoRepository servicoRepository,
        IAtendimentoRepository atendimentoRepository,
        IItemProdutoRepository itemProdutoRepository,
        IItemServicoRepository itemServicoRepository)
    {
        _dbContext = dbContext;
        _clienteService = clienteService;
        _clienteRepository = clienteRepository;
        _produtoRepository = produtoRepository;
        _servicoRepository = servicoRepository;
        _atendimentoRepository = atendimentoRepository;
        _itemProdutoRepository = itemProdutoRepository;
        _itemServicoRepository = itemServicoRepository;
    }

    public async Task<SyncCargaResponse> CargaAsync(long empresaId, DateTime? ultimaSincronizacao, CancellationToken cancellationToken)
    {
        var desde = ultimaSincronizacao ?? DateTime.MinValue;

        var clientes = await _dbContext.Clientes
            .AsNoTracking()
            .Where(c => c.EmpresaId == empresaId && c.DeletedAt == null && c.UpdatedAt > desde)
            .OrderBy(c => c.Nome)
            .Select(c => new ClienteResponse
            {
                Id = c.Id,
                Uuid = c.Uuid.ToString(),
                Nome = c.Nome,
                Telefone = c.Telefone,
                Cpf = c.Cpf,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        var produtos = await _dbContext.Produtos
            .AsNoTracking()
            .Where(p => p.EmpresaId == empresaId && p.DeletedAt == null && p.UpdatedAt > desde)
            .OrderBy(p => p.Nome)
            .Select(p => new ProdutoResponse
            {
                Id = p.Id,
                Uuid = p.Uuid.ToString(),
                Nome = p.Nome,
                Preco = p.Preco,
                QuantidadeEstoque = p.QuantidadeEstoque,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        var servicos = await _dbContext.Servicos
            .AsNoTracking()
            .Where(s => s.EmpresaId == empresaId && s.DeletedAt == null && s.UpdatedAt > desde)
            .OrderBy(s => s.Descricao)
            .Select(s => new ServicoResponse
            {
                Id = s.Id,
                Uuid = s.Uuid.ToString(),
                Descricao = s.Descricao,
                TipoCobranca = s.TipoCobranca,
                ValorHora = s.ValorHora,
                ValorEmpreitada = s.ValorEmpreitada,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        // Orcamentos atualizados desde a ultima sync (com itens) — o agente ve as
        // propostas em campo. Materializa e mapeia em memoria (nested + Uuid.ToString).
        var orcamentosDb = await _dbContext.Orcamentos
            .AsNoTracking()
            .Where(o => o.EmpresaId == empresaId && o.DeletedAt == null && o.UpdatedAt > desde)
            .Include(o => o.Itens)
            .OrderBy(o => o.DataRegistro)
            .ToListAsync(cancellationToken);

        var orcamentos = orcamentosDb
            .Select(o => new OrcamentoResponse
            {
                Id = o.Id,
                Uuid = o.Uuid.ToString(),
                ClienteId = o.ClienteId,
                Status = o.Status,
                ValorTotal = o.ValorTotal,
                DataRegistro = o.DataRegistro,
                AtendimentoConvertidoId = o.AtendimentoConvertidoId,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                Itens = o.Itens
                    .Where(i => i.DeletedAt == null)
                    .Select(i => new ItemOrcamentoResponse
                    {
                        Id = i.Id,
                        ProdutoId = i.ProdutoId,
                        ServicoId = i.ServicoId,
                        Descricao = i.Descricao,
                        Quantidade = i.Quantidade,
                        PrecoUnitario = i.PrecoUnitario,
                        Subtotal = i.Subtotal,
                        Custo = i.Custo
                    })
                    .ToList()
            })
            .ToList();

        // Configuracao da empresa — o mobile precisa dela para saber o modo de
        // agenda (Flexivel/Fixa) e se controla estoque. Vai em toda Carga (nao
        // depende de UpdatedAt: e um unico registro pequeno e sempre relevante).
        var configuracao = await _dbContext.Configuracoes
            .AsNoTracking()
            .Where(c => c.EmpresaId == empresaId)
            .Select(c => new ConfiguracaoResponse
            {
                Id = c.Id,
                TipoOperacao = c.TipoOperacao,
                ModoAgendaAgente = c.ModoAgendaAgente,
                ControlaEstoque = c.ControlaEstoque,
                EmpresaId = c.EmpresaId,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? new ConfiguracaoResponse
            {
                EmpresaId = empresaId,
                TipoOperacao = TipoOperacao.Servico,
                ModoAgendaAgente = ModoAgendaAgente.Flexivel,
                ControlaEstoque = true
            };

        return new SyncCargaResponse
        {
            Clientes = clientes,
            Produtos = produtos,
            Servicos = servicos,
            Orcamentos = orcamentos,
            Configuracao = configuracao,
            SincronizadoEm = DateTime.UtcNow
        };
    }

    public async Task<SyncDescargaResponse> DescargaAsync(long empresaId, long usuarioId, SyncDescargaRequest request, CancellationToken cancellationToken)
    {
        var erros = new List<string>();
        var clientesImportados = 0;
        var atendimentosImportados = 0;

        var config = await _dbContext.Configuracoes
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.EmpresaId == empresaId, cancellationToken);
        // Default seguro: controla. Quando false, itens nao baixam nem validam estoque.
        var controlaEstoque = config?.ControlaEstoque ?? true;
        // Modo Fixa: o agente nao pode agendar (walk-in liberado). Enforcement de
        // servidor — ignora DataAgendada vinda do device, mesmo em payload forjado.
        var agendaFixa = config?.ModoAgendaAgente == ModoAgendaAgente.Fixa;

        // Importa clientes novos
        foreach (var clienteRequest in request.Clientes)
        {
            try
            {
                await _clienteService.CreateAsync(empresaId, clienteRequest, cancellationToken);
                clientesImportados++;
            }
            catch (CpfAlreadyExistsException)
            {
                // CPF já existe — última escrita por UpdatedAt prevalece (DEC-06)
                // Por ora ignora silenciosamente, sem contar como erro
            }
            catch (Exception ex)
            {
                erros.Add($"Cliente '{clienteRequest.Nome}': {ex.Message}");
            }
        }

        // Importa atendimentos offline
        foreach (var atendimentoRequest in request.Atendimentos)
        {
            await using var tx = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                // Verifica se já foi sincronizado pelo Uuid
                var jaExiste = await _dbContext.Atendimentos
                    .AnyAsync(a => a.Uuid == atendimentoRequest.Uuid, cancellationToken);

                if (jaExiste)
                {
                    await tx.RollbackAsync(cancellationToken);
                    continue;
                }

                var atendimento = new Atendimento
                {
                    Uuid = atendimentoRequest.Uuid,
                    EmpresaId = empresaId,
                    UsuarioId = usuarioId,
                    ClienteId = atendimentoRequest.ClienteId,
                    Status = atendimentoRequest.Status,
                    DataRegistro = atendimentoRequest.DataRegistro,
                    DataAgendada = agendaFixa ? null : atendimentoRequest.DataAgendada,
                    ValorTotal = 0m,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _atendimentoRepository.AddAsync(atendimento, cancellationToken);
                await _atendimentoRepository.SaveChangesAsync(cancellationToken);

                var totalProdutos = 0m;
                var totalServicos = 0m;

                foreach (var itemProduto in atendimentoRequest.ItensProduto)
                {
                    var produto = await _produtoRepository.GetByIdAsync(empresaId, itemProduto.ProdutoId, true, cancellationToken);
                    if (produto is null)
                    {
                        erros.Add($"Atendimento '{atendimentoRequest.Uuid}': Produto {itemProduto.ProdutoId} nao encontrado.");
                        continue;
                    }

                    if (controlaEstoque && produto.QuantidadeEstoque < itemProduto.Quantidade)
                    {
                        erros.Add($"Atendimento '{atendimentoRequest.Uuid}': Estoque insuficiente para produto '{produto.Nome}'.");
                        continue;
                    }

                    if (controlaEstoque)
                    {
                        produto.QuantidadeEstoque -= itemProduto.Quantidade;
                        produto.UpdatedAt = DateTime.UtcNow;
                    }

                    var subtotal = itemProduto.Quantidade * produto.Preco;
                    totalProdutos += subtotal;

                    await _itemProdutoRepository.AddAsync(new ItemProduto
                    {
                        Uuid = Guid.NewGuid(),
                        AtendimentoId = atendimento.Id,
                        ProdutoId = itemProduto.ProdutoId,
                        Quantidade = itemProduto.Quantidade,
                        PrecoUnitario = produto.Preco,
                        Subtotal = subtotal,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }, cancellationToken);
                }

                foreach (var itemServico in atendimentoRequest.ItensServico)
                {
                    var servico = await _servicoRepository.GetByIdAsync(empresaId, itemServico.ServicoId, false, cancellationToken);
                    if (servico is null)
                    {
                        erros.Add($"Atendimento '{atendimentoRequest.Uuid}': Servico {itemServico.ServicoId} nao encontrado.");
                        continue;
                    }

                    var precoUnitario = servico.TipoCobranca == Enums.TipoCobranca.Empreitada
                        ? servico.ValorEmpreitada!.Value
                        : servico.ValorHora ?? 0;

                    var subtotal = servico.TipoCobranca == Enums.TipoCobranca.Empreitada
                        ? servico.ValorEmpreitada!.Value
                        : itemServico.Quantidade * (servico.ValorHora ?? 0);

                    totalServicos += subtotal;

                    await _itemServicoRepository.AddAsync(new ItemServico
                    {
                        Uuid = Guid.NewGuid(),
                        AtendimentoId = atendimento.Id,
                        ServicoId = itemServico.ServicoId,
                        Quantidade = itemServico.Quantidade,
                        PrecoUnitario = precoUnitario,
                        Subtotal = subtotal,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }, cancellationToken);
                }

                atendimento.ValorTotal = totalProdutos + totalServicos;
                atendimento.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync(cancellationToken);
                await tx.CommitAsync(cancellationToken);
                atendimentosImportados++;
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync(cancellationToken);
                erros.Add($"Atendimento '{atendimentoRequest.Uuid}': {ex.Message}");
            }
        }

        return new SyncDescargaResponse
        {
            AtendimentosImportados = atendimentosImportados,
            ClientesImportados = clientesImportados,
            Erros = erros,
            SincronizadoEm = DateTime.UtcNow
        };
    }
}