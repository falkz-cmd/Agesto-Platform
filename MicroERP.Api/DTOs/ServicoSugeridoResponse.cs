namespace MicroERP.Api.DTOs;

public sealed class ServicoSugeridoResponse
{
    public long ProdutoId { get; set; }
    public string ProdutoNome { get; set; } = string.Empty;
    public int QuantidadePadrao { get; set; }
}
