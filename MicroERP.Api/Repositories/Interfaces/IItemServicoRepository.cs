using MicroERP.Api.Models;

namespace MicroERP.Api.Repositories.Interfaces;

public interface IItemServicoRepository
{
    Task<List<ItemServico>> GetAllByAtendimentoAsync(long empresaId, long atendimentoId, CancellationToken cancellationToken);
    Task<List<ItemServico>> GetAllByAtendimentoTrackedAsync(long atendimentoId, CancellationToken cancellationToken);
    Task<ItemServico?> GetByIdAsync(long empresaId, long id, bool track, CancellationToken cancellationToken);
    Task<decimal> SumSubtotalByAtendimentoAsync(long atendimentoId, CancellationToken cancellationToken);
    Task AddAsync(ItemServico itemServico, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}