namespace MicroERP.Api.DTOs;

/// <summary>Material sugerido de um serviço, achatado para a Carga do mobile.</summary>
public sealed class SyncSugeridoResponse
{
    public long ServicoId { get; set; }
    public long ProdutoId { get; set; }
    public int QuantidadePadrao { get; set; }
}
