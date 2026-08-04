using MicroERP.Api.Models;

namespace MicroERP.Api.Repositories.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByIdAsync(long id, CancellationToken cancellationToken);
    Task<int> CountDonos(long empresaId, CancellationToken cancellationToken);
    Task DeleteAsync(Usuario usuario, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}