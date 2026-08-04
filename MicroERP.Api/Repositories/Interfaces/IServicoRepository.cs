using MicroERP.Api.Models;

namespace MicroERP.Api.Repositories.Interfaces;

public interface IServicoRepository
{
    Task<List<Servico>> GetAllAsync(long empresaId, CancellationToken cancellationToken);
    Task<Servico?> GetByIdAsync(long empresaId, long id, bool track, CancellationToken cancellationToken);
    Task AddAsync(Servico servico, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}