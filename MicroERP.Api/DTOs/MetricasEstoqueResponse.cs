namespace MicroERP.Api.DTOs;

public sealed class MetricasEstoqueResponse
{
    public IReadOnlyList<ProdutoGiroItem> Giro { get; set; } = Array.Empty<ProdutoGiroItem>();
    public IReadOnlyList<ProdutoParadoItem> ProdutosParados { get; set; } = Array.Empty<ProdutoParadoItem>();
    public IReadOnlyList<RupturaIminenteItem> RupturaIminente { get; set; } = Array.Empty<RupturaIminenteItem>();
}

public sealed class ProdutoGiroItem
{
    public long ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int QuantidadeEstoque { get; set; }
    public int UnidadesVendidas { get; set; }
}

public sealed class ProdutoParadoItem
{
    public long ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int QuantidadeEstoque { get; set; }
    public DateTime? UltimaVenda { get; set; }
}

public sealed class RupturaIminenteItem
{
    public long ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int QuantidadeEstoque { get; set; }
    public double ConsumoDiarioMedio { get; set; }
    public double DiasAteRuptura { get; set; }
}
