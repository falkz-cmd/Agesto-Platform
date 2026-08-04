using MicroERP.Api.Models;

namespace MicroERP.Api.Repositories.Interfaces;

public interface IConfiguracaoRepository
{
    Task<Configuracao?> GetByEmpresaAsync(long empresaId, bool track, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}