namespace MicroERP.Api.Models;

public class ItemProduto
{
    public long Id { get; set; }
    public Guid Uuid { get; set; }
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Subtotal { get; set; }
    public decimal? Custo { get; set; }
    public string? Descricao { get; set; }
    public long AtendimentoId { get; set; }
    public long? ProdutoId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SyncedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Atendimento? Atendimento { get; set; }
    public Produto? Produto { get; set; }
}
