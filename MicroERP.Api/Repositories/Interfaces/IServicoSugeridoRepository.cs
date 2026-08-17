using MicroERP.Api.Models;

namespace MicroERP.Api.Repositories.Interfaces;

public interface IServicoSugeridoRepository
{
    Task<IReadOnlyList<ServicoItemSugerido>> GetByServicoAsync(long empresaId, long servicoId, CancellationToken cancellationToken);

    /// <summary>Substitui todo o conjunto de sugeridos de um serviço (delete-all + insert).</summary>
    Task ReplaceForServicoAsync(long empresaId, long servicoId, IReadOnlyList<ServicoItemSugerido> novos, CancellationToken cancellationToken);
}
