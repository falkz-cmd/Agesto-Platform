namespace MicroERP.Api.Models;

using MicroERP.Api.Enums;

public class Usuario
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public long EmpresaId { get; set; }
    public PerfilUsuario Perfil { get; set; } = PerfilUsuario.Dono;
    public Empresa? Empresa { get; set; }
}
