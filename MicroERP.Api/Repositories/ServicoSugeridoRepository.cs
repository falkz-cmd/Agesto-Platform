using Microsoft.EntityFrameworkCore;
using MicroERP.Api.Data;
using MicroERP.Api.Models;
using MicroERP.Api.Repositories.Interfaces;

namespace MicroERP.Api.Repositories;

public sealed class ServicoSugeridoRepository : IServicoSugeridoRepository
{
    private readonly AppDbContext _dbContext;

    public ServicoSugeridoRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ServicoItemSugerido>> GetByServicoAsync(long empresaId, long servicoId, CancellationToken cancellationToken)
    {
        return await _dbContext.ServicoItemSugeridos
            .AsNoTracking()
            .Where(s => s.EmpresaId == empresaId && s.ServicoId == servicoId)
            .Include(s => s.Produto)
            .OrderBy(s => s.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task ReplaceForServicoAsync(long empresaId, long servicoId, IReadOnlyList<ServicoItemSugerido> novos, CancellationToken cancellationToken)
    {
        var existentes = await _dbContext.ServicoItemSugeridos
            .Where(s => s.EmpresaId == empresaId && s.ServicoId == servicoId)
            .ToListAsync(cancellationToken);

        _dbContext.ServicoItemSugeridos.RemoveRange(existentes);
        await _dbContext.ServicoItemSugeridos.AddRangeAsync(novos, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
