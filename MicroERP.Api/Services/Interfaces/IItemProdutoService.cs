using MicroERP.Api.DTOs;

namespace MicroERP.Api.Services.Interfaces;

public interface IItemProdutoService
{
    Task<IReadOnlyList<ItemProdutoResponse>> GetAllByAtendimentoAsync(long empresaId, long atendimentoId, CancellationToken cancellationToken);
    Task<ItemProdutoResponse> GetByIdAsync(long empresaId, long id, CancellationToken cancellationToken);
    Task<ItemProdutoResponse> CreateAsync(long empresaId, ItemProdutoCreateRequest request, CancellationToken cancellationToken);
    Task<ItemProdutoResponse> UpdateAsync(long empresaId, long id, ItemProdutoUpdateRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(long empresaId, long id, CancellationToken cancellationToken);
}
