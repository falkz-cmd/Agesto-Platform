namespace MicroERP.Api.DTOs;

public sealed class DashboardResponse
{
    public DateTime De { get; set; }
    public DateTime Ate { get; set; }
    // Rentabilidade.Faturamento = soma de Atendimento.ValorTotal (nivel atendimento).
    // Vendas.ReceitaTotal = soma de ItemProduto.Subtotal (nivel item de produto).
    // Sao propositalmente diferentes: um atendimento so de servico entra no Faturamento
    // mas nao em Vendas. Nao somar os dois como se fossem a mesma coisa.
    public MetricasRentabilidadeResponse Rentabilidade { get; set; } = new();
    public MetricasVendasResponse Vendas { get; set; } = new();
    public MetricasServicosResponse Servicos { get; set; } = new();
    public MetricasEstoqueResponse Estoque { get; set; } = new();
}
