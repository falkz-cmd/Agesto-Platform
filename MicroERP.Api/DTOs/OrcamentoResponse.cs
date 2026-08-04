using MicroERP.Api.Enums;

namespace MicroERP.Api.DTOs;

public sealed class OrcamentoResponse
{
    public long Id { get; set; }
    public string Uuid { get; set; } = string.Empty;
    public long ClienteId { get; set; }
    public StatusOrcamento Status { get; set; }
    public decimal ValorTotal { get; set; }
    public DateTime DataRegistro { get; set; }
    public long? AtendimentoConvertidoId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public IReadOnlyList<ItemOrcamentoResponse> Itens { get; set; } = Array.Empty<ItemOrcamentoResponse>();
}

public sealed class ItemOrcamentoResponse
{
    public long Id { get; set; }
    public long? ProdutoId { get; set; }
    public long? ServicoId { get; set; }
    public string? Descricao { get; set; }
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Subtotal { get; set; }
    public decimal? Custo { get; set; }
}
