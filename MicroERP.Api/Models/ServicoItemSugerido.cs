namespace MicroERP.Api.Models;

/// <summary>
/// Material que costuma ser usado num Serviço (kit / lista técnica). Ao adicionar
/// o serviço num orçamento/atendimento, esses itens são sugeridos. Referencia
/// sempre um Produto de catálogo (id estável). Ver DEC-28 / Plano 2.
/// </summary>
public class ServicoItemSugerido
{
    public long Id { get; set; }
    public long EmpresaId { get; set; }
    public long ServicoId { get; set; }
    public long ProdutoId { get; set; }
    public int QuantidadePadrao { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Servico? Servico { get; set; }
    public Produto? Produto { get; set; }
}
