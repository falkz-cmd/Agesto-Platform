using MicroERP.Api.DTOs;

namespace MicroERP.Api.Services.Interfaces;

public interface IConfiguracaoService
{
    Task<ConfiguracaoResponse?> GetByEmpresaAsync(long empresaId, CancellationToken cancellationToken);
    Task<ConfiguracaoResponse?> UpdateAsync(long empresaId, ConfiguracaoUpdateRequest request, CancellationToken cancellationToken);
}