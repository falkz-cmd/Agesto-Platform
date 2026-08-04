using MicroERP.Api.DTOs;

namespace MicroERP.Api.DTOs;

public sealed class SyncCargaResponse
{
    public IReadOnlyList<ClienteResponse> Clientes { get; set; } = [];
    public IReadOnlyList<ProdutoResponse> Produtos { get; set; } = [];
    public IReadOnlyList<ServicoResponse> Servicos { get; set; } = [];
    public IReadOnlyList<OrcamentoResponse> Orcamentos { get; set; } = [];
    public DateTime SincronizadoEm { get; set; }
}