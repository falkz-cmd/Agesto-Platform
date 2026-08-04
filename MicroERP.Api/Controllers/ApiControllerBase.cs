using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using MicroERP.Api.Enums;

namespace MicroERP.Api.Controllers;

public abstract class ApiControllerBase : ControllerBase
{
    protected bool TryGetEmpresaId(out long empresaId)
    {
        empresaId = 0;
        var claim = User.FindFirstValue("empresaId");
        return long.TryParse(claim, out empresaId);
    }

    protected bool TryGetPerfil(out PerfilUsuario perfil)
    {
        perfil = PerfilUsuario.Nenhum;
        var claim = User.FindFirstValue("perfil");
        return Enum.TryParse(claim, out perfil) && perfil != PerfilUsuario.Nenhum;
    }

    protected bool TryGetUsuarioId(out long usuarioId)
    {
        usuarioId = 0;
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return long.TryParse(sub, out usuarioId);
    }
}