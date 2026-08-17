using MicroERP.Api.DTOs;

namespace MicroERP.Api.Services.Interfaces;

public interface IServicoSugeridoService
{
    Task<IReadOnlyList<ServicoSugeridoResponse>> GetByServicoAsync(long empresaId, long servicoId, CancellationToken cancellationToken);

    Task<IReadOnlyList<ServicoSugeridoResponse>> ReplaceAsync(long empresaId, long servicoId, IReadOnlyList<ServicoSugeridoRequest> itens, CancellationToken cancellationToken);
}
