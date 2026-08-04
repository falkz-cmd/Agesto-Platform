namespace MicroERP.Api.DTOs;

// Resumo de rentabilidade do periodo (atendimentos Concluidos): alimenta os KPIs
// do painel Web do dono (faturamento, margem, ticket medio). Margem = faturamento
// - custo (custo vem dos itens de produto, DEC-19/KAN-73).
public sealed class MetricasRentabilidadeResponse
{
    public decimal Faturamento { get; set; }
    public decimal CustoTotal { get; set; }
    public decimal Margem { get; set; }
    public decimal MargemPercentual { get; set; }
    public int Atendimentos { get; set; }
    public decimal TicketMedio { get; set; }
}
