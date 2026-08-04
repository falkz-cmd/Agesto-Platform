using MicroERP.Api.DTOs;

namespace MicroERP.Api.Services.Interfaces;

public interface IItemServicoService
{
    Task<IReadOnlyList<ItemServicoResponse>> GetAllByAtendimentoAsync(long empresaId, long atendimentoId, CancellationToken cancellationToken);
    Task<ItemServicoResponse> GetByIdAsync(long empresaId, long id, CancellationToken cancellationToken);
    Task<ItemServicoResponse> CreateAsync(long empresaId, ItemServicoCreateRequest request, CancellationToken cancellationToken);
    Task<ItemServicoResponse> UpdateAsync(long empresaId, long id, ItemServicoUpdateRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(long empresaId, long id, CancellationToken cancellationToken);
}
