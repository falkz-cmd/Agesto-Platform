using MicroERP.Api.Enums;

namespace MicroERP.Api.DTOs;

public sealed class AtendimentoSyncRequest
{
    public Guid Uuid { get; set; }
    public DateTime DataRegistro { get; set; }
    public DateTime? DataAgendada { get; set; }
    public StatusAtendimento Status { get; set; }
    public long ClienteId { get; set; }
    public IReadOnlyList<ItemProdutoSyncRequest> ItensProduto { get; set; } = [];
    public IReadOnlyList<ItemServicoSyncRequest> ItensServico { get; set; } = [];
}