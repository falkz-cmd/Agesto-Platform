using MicroERP.Api.DTOs;

namespace MicroERP.Api.DTOs;

public sealed class SyncDescargaRequest
{
    public IReadOnlyList<ClienteCreateRequest> Clientes { get; set; } = [];
    public IReadOnlyList<AtendimentoSyncRequest> Atendimentos { get; set; } = [];
}