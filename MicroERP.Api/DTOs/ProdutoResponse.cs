namespace MicroERP.Api.DTOs;

public sealed class ProdutoResponse
{
    public long Id { get; set; }
    public string Uuid { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public int QuantidadeEstoque { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
