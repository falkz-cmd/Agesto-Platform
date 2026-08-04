using System.ComponentModel.DataAnnotations;
using MicroERP.Api.Enums;

namespace MicroERP.Api.DTOs;

public sealed class ConfiguracaoUpdateRequest
{
    [Required(ErrorMessage = "TipoOperacao e obrigatorio.")]
    public TipoOperacao? TipoOperacao { get; set; }
}