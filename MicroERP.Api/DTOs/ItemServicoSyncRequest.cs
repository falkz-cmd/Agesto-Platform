namespace MicroERP.Api.DTOs;

public sealed class ItemServicoSyncRequest
{
    public long ServicoId { get; set; }
    public int Quantidade { get; set; }
}