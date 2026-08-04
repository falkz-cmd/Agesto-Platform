using System.ComponentModel.DataAnnotations;

namespace MicroERP.Api.DTOs;

public sealed class AuthLoginRequest
{
    [Required(ErrorMessage = "Email obrigatorio.")]
    [EmailAddress(ErrorMessage = "Email invalido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha obrigatoria.")]
    [MinLength(8, ErrorMessage = "Senha deve ter no minimo 8 caracteres.")]
    public string Senha { get; set; } = string.Empty;
}
