using Microsoft.EntityFrameworkCore;
using MicroERP.Api.Data;
using MicroERP.Api.Models;
using MicroERP.Api.Enums;
using MicroERP.Api.Repositories.Interfaces;

namespace MicroERP.Api.Repositories;

public sealed class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _dbContext;

    public UsuarioRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Usuario?> GetByIdAsync(long id, CancellationToken cancellationToken)
    {
        return await _dbContext.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<int> CountDonos(long empresaId, CancellationToken cancellationToken)
    {
        return await _dbContext.Usuarios
            .CountAsync(u => u.EmpresaId == empresaId && u.Perfil == PerfilUsuario.Dono, cancellationToken);
    }

    public async Task DeleteAsync(Usuario usuario, CancellationToken cancellationToken)
    {
        _dbContext.Usuarios.Remove(usuario);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}