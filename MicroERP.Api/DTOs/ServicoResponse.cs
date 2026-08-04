using MicroERP.Api.Enums;

namespace MicroERP.Api.DTOs;

public sealed class ServicoResponse
{
    public long Id { get; set; }
    public string Uuid { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal? ValorHora { get; set; }
    public decimal? ValorEmpreitada { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public TipoCobranca TipoCobranca { get; set; }
}
