using MicroERP.Api.DTOs;

namespace MicroERP.Api.Repositories.Interfaces;

public interface IMetricasRepository
{
    Task<MetricasRentabilidadeResponse> GetRentabilidadeAsync(long empresaId, DateTime de, DateTime ate, CancellationToken cancellationToken);
    Task<MetricasVendasResponse> GetVendasAsync(long empresaId, DateTime de, DateTime ate, CancellationToken cancellationToken);
    Task<MetricasServicosResponse> GetServicosAsync(long empresaId, DateTime de, DateTime ate, CancellationToken cancellationToken);
    Task<MetricasEstoqueResponse> GetEstoqueAsync(long empresaId, DateTime de, DateTime ate, CancellationToken cancellationToken);
}
