using MicroERP.Api.Models;

namespace MicroERP.Api.Repositories.Interfaces;

public interface IItemProdutoRepository
{
    Task<List<ItemProduto>> GetAllByAtendimentoAsync(long empresaId, long atendimentoId, CancellationToken cancellationToken);
    Task<List<ItemProduto>> GetAllByAtendimentoTrackedAsync(long atendimentoId, CancellationToken cancellationToken);
    Task<ItemProduto?> GetByIdAsync(long empresaId, long id, bool track, CancellationToken cancellationToken);
    Task<decimal> SumSubtotalByAtendimentoAsync(long atendimentoId, CancellationToken cancellationToken);
    Task<decimal> SumCustoByAtendimentoAsync(long atendimentoId, CancellationToken cancellationToken);
    Task AddAsync(ItemProduto itemProduto, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}