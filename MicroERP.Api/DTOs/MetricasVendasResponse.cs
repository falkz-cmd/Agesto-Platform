namespace MicroERP.Api.DTOs;

public sealed class MetricasVendasResponse
{
    public decimal ReceitaTotal { get; set; }
    public decimal TicketMedio { get; set; }
    public int TotalAtendimentos { get; set; }
    public IReadOnlyList<ProdutoRankingItem> TopProdutos { get; set; } = Array.Empty<ProdutoRankingItem>();
    public IReadOnlyList<FaturamentoPontoPeriodo> ReceitaPorPeriodo { get; set; } = Array.Empty<FaturamentoPontoPeriodo>();
}

public sealed class ProdutoRankingItem
{
    public long ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal Receita { get; set; }
}

public sealed class FaturamentoPontoPeriodo
{
    public DateTime Data { get; set; }
    public decimal Valor { get; set; }
}
