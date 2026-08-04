using MicroERP.Api.DTOs;

namespace MicroERP.Api.Services.Interfaces;

public interface IMetricasService
{
    Task<MetricasRentabilidadeResponse> GetRentabilidadeAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken);
    Task<MetricasVendasResponse> GetVendasAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken);
    Task<MetricasServicosResponse> GetServicosAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken);
    Task<MetricasEstoqueResponse> GetEstoqueAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken);
    Task<DashboardResponse> GetDashboardAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken);
}
