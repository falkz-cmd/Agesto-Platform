using Microsoft.EntityFrameworkCore;
using MicroERP.Api.Data;
using MicroERP.Api.Enums;
using MicroERP.Api.Models;
using MicroERP.Api.Repositories;

namespace MicroERP.Tests.Repositories;

public sealed class AtendimentoRepositoryTests
{
    private static readonly DateTime De = new(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc);
    private static readonly DateTime Ate = new(2026, 7, 31, 23, 59, 59, DateTimeKind.Utc);

    [Fact]
    public async Task GetAgendaAsync_FiltraPorPeriodoEmpresaEAgente()
    {
        await using var db = CreateContext();

        db.Clientes.Add(new Cliente { Id = 1, Uuid = Guid.NewGuid(), Nome = "Cliente 1", Cpf = "cpf1", EmpresaId = 1 });
        db.Atendimentos.AddRange(
            At(1, empresaId: 1, usuarioId: 5, agendada: new DateTime(2026, 7, 10, 9, 0, 0, DateTimeKind.Utc)),   // ok
            At(2, empresaId: 1, usuarioId: 5, agendada: new DateTime(2026, 8, 10, 9, 0, 0, DateTimeKind.Utc)),   // fora do periodo
            At(3, empresaId: 1, usuarioId: 5, agendada: null),                                                    // sem agenda
            At(4, empresaId: 2, usuarioId: 5, agendada: new DateTime(2026, 7, 12, 9, 0, 0, DateTimeKind.Utc)),   // outra empresa
            At(5, empresaId: 1, usuarioId: 9, agendada: new DateTime(2026, 7, 20, 9, 0, 0, DateTimeKind.Utc)));  // outro agente

        var deletado = At(6, empresaId: 1, usuarioId: 5, agendada: new DateTime(2026, 7, 25, 9, 0, 0, DateTimeKind.Utc));
        deletado.DeletedAt = DateTime.UtcNow;
        db.Atendimentos.Add(deletado);
        await db.SaveChangesAsync();

        var repo = new AtendimentoRepository(db);

        // Sem filtro de agente (Dono): empresa 1, no periodo, com DataAgendada, nao deletado -> ids 1 e 5
        var todos = await repo.GetAgendaAsync(1, De, Ate, null, CancellationToken.None);
        Assert.Equal(new long[] { 1, 5 }, todos.Select(a => a.Id).ToArray());

        // Filtrando pelo agente 5: só o id 1
        var doAgente = await repo.GetAgendaAsync(1, De, Ate, 5L, CancellationToken.None);
        Assert.Single(doAgente);
        Assert.Equal(1, doAgente[0].Id);
    }

    private static Atendimento At(long id, long empresaId, long usuarioId, DateTime? agendada) => new()
    {
        Id = id,
        Uuid = Guid.NewGuid(),
        EmpresaId = empresaId,
        UsuarioId = usuarioId,
        ClienteId = 1,
        Status = StatusAtendimento.Pendente,
        DataRegistro = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
        DataAgendada = agendada
    };

    private static AppDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);
}
