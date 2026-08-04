namespace MicroERP.Api.Services.Interfaces;

public interface IUsuarioService
{
    Task<bool> DeleteAsync(long usuarioId, long empresaId, CancellationToken cancellationToken);
}