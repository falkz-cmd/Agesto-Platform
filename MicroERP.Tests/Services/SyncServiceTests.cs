using Microsoft.EntityFrameworkCore;
using MicroERP.Api.Data;
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
            .Options);
}
