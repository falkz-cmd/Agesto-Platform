using MicroERP.Api.DTOs;
using MicroERP.Api.Repositories.Interfaces;
using MicroERP.Api.Services.Interfaces;

namespace MicroERP.Api.Services;

public sealed class MetricasService : IMetricasService
{
    private readonly IMetricasRepository _metricasRepository;

    public MetricasService(IMetricasRepository metricasRepository)
    {
        _metricasRepository = metricasRepository;
    }

    public Task<MetricasRentabilidadeResponse> GetRentabilidadeAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken)
    {
        var (inicio, fim) = ResolvePeriodo(de, ate);
        return _metricasRepository.GetRentabilidadeAsync(empresaId, inicio, fim, cancellationToken);
    }

    public Task<MetricasVendasResponse> GetVendasAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken)
    {
        var (inicio, fim) = ResolvePeriodo(de, ate);
        return _metricasRepository.GetVendasAsync(empresaId, inicio, fim, cancellationToken);
    }

    public Task<MetricasServicosResponse> GetServicosAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken)
    {
        var (inicio, fim) = ResolvePeriodo(de, ate);
        return _metricasRepository.GetServicosAsync(empresaId, inicio, fim, cancellationToken);
    }

    public Task<MetricasEstoqueResponse> GetEstoqueAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken)
    {
        var (inicio, fim) = ResolvePeriodo(de, ate);
        return _metricasRepository.GetEstoqueAsync(empresaId, inicio, fim, cancellationToken);
    }

    public async Task<DashboardResponse> GetDashboardAsync(long empresaId, DateTime? de, DateTime? ate, CancellationToken cancellationToken)
    {
        var (inicio, fim) = ResolvePeriodo(de, ate);

        var rentabilidade = await _metricasRepository.GetRentabilidadeAsync(empresaId, inicio, fim, cancellationToken);
        var vendas = await _metricasRepository.GetVendasAsync(empresaId, inicio, fim, cancellationToken);
        var servicos = await _metricasRepository.GetServicosAsync(empresaId, inicio, fim, cancellationToken);
        var estoque = await _metricasRepository.GetEstoqueAsync(empresaId, inicio, fim, cancellationToken);

        return new DashboardResponse
        {
            De = inicio,
            Ate = fim,
            Rentabilidade = rentabilidade,
            Vendas = vendas,
            Servicos = servicos,
            Estoque = estoque
        };
    }

    // Periodo padrao: do primeiro dia do mes corrente ate agora (UTC).
    private static (DateTime Inicio, DateTime Fim) ResolvePeriodo(DateTime? de, DateTime? ate)
    {
        var agora = DateTime.UtcNow;
        var inicio = de ?? new DateTime(agora.Year, agora.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var fim = ate ?? agora;
        return (inicio, fim);
    }
}
