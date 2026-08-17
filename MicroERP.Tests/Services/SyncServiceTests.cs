using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using MicroERP.Api.Data;
using MicroERP.Api.DTOs;
using MicroERP.Api.Enums;
using MicroERP.Api.Models;
using MicroERP.Api.Repositories;
using MicroERP.Api.Services;

namespace MicroERP.Tests.Services;

public sealed class SyncServiceTests
{
    [Fact]
    public async Task CargaAsync_TrazOrcamentosAtualizadosDaEmpresaComItens()
    {
        await using var db = CreateContext();
        var antiga = DateTime.UtcNow.AddDays(-10);

        // Recente, empresa 1 -> deve vir (com item)
        db.Orcamentos.Add(new Orcamento
        {
            Id = 1,
            Uuid = Guid.NewGuid(),
            EmpresaId = 1,
            UsuarioId = 1,
            ClienteId = 1,
            Status = StatusOrcamento.Enviado,
            DataRegistro = DateTime.UtcNow,
            ValorTotal = 100m,
            UpdatedAt = DateTime.UtcNow,
            Itens = new List<ItemOrcamento>
            {
                new() { Uuid = Guid.NewGuid(), ServicoId = 5, Quantidade = 1, PrecoUnitario = 100m, Subtotal = 100m }
            }
        });
        // Antigo (antes do 'desde') -> nao vem
        db.Orcamentos.Add(new Orcamento { Id = 2, Uuid = Guid.NewGuid(), EmpresaId = 1, UsuarioId = 1, ClienteId = 1, Status = StatusOrcamento.Rascunho, DataRegistro = antiga, ValorTotal = 50m, UpdatedAt = antiga });
        // Outra empresa -> nao vem
        db.Orcamentos.Add(new Orcamento { Id = 3, Uuid = Guid.NewGuid(), EmpresaId = 2, UsuarioId = 1, ClienteId = 1, Status = StatusOrcamento.Enviado, DataRegistro = DateTime.UtcNow, ValorTotal = 999m, UpdatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var service = BuildSync(db);
        var carga = await service.CargaAsync(1, DateTime.UtcNow.AddDays(-1), CancellationToken.None);

        Assert.Single(carga.Orcamentos);
        Assert.Equal(1, carga.Orcamentos[0].Id);
        Assert.Equal(StatusOrcamento.Enviado, carga.Orcamentos[0].Status);
        Assert.Single(carga.Orcamentos[0].Itens);
        Assert.Equal(5, carga.Orcamentos[0].Itens[0].ServicoId);
    }

    [Fact]
    public async Task CargaAsync_IncluiConfiguracaoDaEmpresa()
    {
        await using var db = CreateContext();
        db.Configuracoes.Add(new Configuracao
        {
            Id = 1,
            EmpresaId = 1,
            TipoOperacao = TipoOperacao.Servico,
            ModoAgendaAgente = ModoAgendaAgente.Fixa,
            ControlaEstoque = false,
        });
        await db.SaveChangesAsync();

        var carga = await BuildSync(db).CargaAsync(1, null, CancellationToken.None);

        Assert.NotNull(carga.Configuracao);
        Assert.Equal(ModoAgendaAgente.Fixa, carga.Configuracao!.ModoAgendaAgente);
        Assert.False(carga.Configuracao.ControlaEstoque);
    }

    [Fact]
    public async Task CargaAsync_SemConfiguracao_RetornaPadraoSeguro()
    {
        await using var db = CreateContext();

        var carga = await BuildSync(db).CargaAsync(1, null, CancellationToken.None);

        Assert.NotNull(carga.Configuracao);
        Assert.Equal(ModoAgendaAgente.Flexivel, carga.Configuracao!.ModoAgendaAgente);
        Assert.True(carga.Configuracao.ControlaEstoque);
    }

    [Fact]
    public async Task CargaAsync_IncluiMateriaisSugeridosDosServicos()
    {
        await using var db = CreateContext();
        db.ServicoItemSugeridos.Add(new ServicoItemSugerido { Id = 1, EmpresaId = 1, ServicoId = 5, ProdutoId = 10, QuantidadePadrao = 2 });
        db.ServicoItemSugeridos.Add(new ServicoItemSugerido { Id = 2, EmpresaId = 2, ServicoId = 9, ProdutoId = 99, QuantidadePadrao = 1 }); // outra empresa
        await db.SaveChangesAsync();

        var carga = await BuildSync(db).CargaAsync(1, null, CancellationToken.None);

        Assert.Single(carga.Sugeridos);
        Assert.Equal(5, carga.Sugeridos[0].ServicoId);
        Assert.Equal(10, carga.Sugeridos[0].ProdutoId);
        Assert.Equal(2, carga.Sugeridos[0].QuantidadePadrao);
    }

    [Fact]
    public async Task DescargaAsync_ModoFixa_IgnoraDataAgendada()
    {
        await using var db = CreateContext();
        db.Configuracoes.Add(new Configuracao { Id = 1, EmpresaId = 1, ModoAgendaAgente = ModoAgendaAgente.Fixa, ControlaEstoque = true });
        await db.SaveChangesAsync();

        var req = new SyncDescargaRequest
        {
            Clientes = [],
            Atendimentos =
            [
                new AtendimentoSyncRequest
                {
                    Uuid = Guid.NewGuid(),
                    DataRegistro = DateTime.UtcNow,
                    DataAgendada = DateTime.UtcNow.AddDays(2),
                    Status = StatusAtendimento.Pendente,
                    ClienteId = 1,
                    ItensProduto = [],
                    ItensServico = [],
                },
            ],
        };

        var res = await BuildSync(db).DescargaAsync(1, 1, req, CancellationToken.None);

        Assert.Equal(1, res.AtendimentosImportados);
        var at = await db.Atendimentos.FirstAsync();
        Assert.Null(at.DataAgendada); // Fixa: agendamento vindo do agente é ignorado no servidor
    }

    [Fact]
    public async Task DescargaAsync_ModoFlexivel_MantemDataAgendada()
    {
        await using var db = CreateContext();
        db.Configuracoes.Add(new Configuracao { Id = 1, EmpresaId = 1, ModoAgendaAgente = ModoAgendaAgente.Flexivel });
        await db.SaveChangesAsync();

        var req = new SyncDescargaRequest
        {
            Clientes = [],
            Atendimentos =
            [
                new AtendimentoSyncRequest
                {
                    Uuid = Guid.NewGuid(),
                    DataRegistro = DateTime.UtcNow,
                    DataAgendada = DateTime.UtcNow.AddDays(2),
                    Status = StatusAtendimento.Pendente,
                    ClienteId = 1,
                    ItensProduto = [],
                    ItensServico = [],
                },
            ],
        };

        await BuildSync(db).DescargaAsync(1, 1, req, CancellationToken.None);

        var at = await db.Atendimentos.FirstAsync();
        Assert.NotNull(at.DataAgendada); // Flexível: agendamento do agente é preservado
    }

    private static SyncService BuildSync(AppDbContext db)
    {
        var clienteRepo = new ClienteRepository(db);
        return new SyncService(
            db,
            new ClienteService(clienteRepo),
            clienteRepo,
            new ProdutoRepository(db),
            new ServicoRepository(db),
            new AtendimentoRepository(db),
            new ItemProdutoRepository(db),
            new ItemServicoRepository(db));
    }

    private static AppDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options);
}
