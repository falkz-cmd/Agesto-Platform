namespace MicroERP.Api.DTOs;

public sealed class ItemProdutoSyncRequest
{
    public long ProdutoId { get; set; }
    public int Quantidade { get; set; }
}