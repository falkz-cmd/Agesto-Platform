namespace MicroERP.Api.Models;

public class ItemOrcamento
{
    public long Id { get; set; }
    public Guid Uuid { get; set; }
    public long OrcamentoId { get; set; }
    public Orcamento? Orcamento { get; set; }
    // Item de catalogo (ProdutoId ou ServicoId) ou avulso (ambos nulos + Descricao).
    // Orcamento NAO baixa estoque; a baixa acontece so na conversao para Atendimento.
    public long? ProdutoId { get; set; }
    public long? ServicoId { get; set; }
    public string? Descricao { get; set; }
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Subtotal { get; set; }
    public decimal? Custo { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SyncedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
