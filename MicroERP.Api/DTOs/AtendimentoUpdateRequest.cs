using MicroERP.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace MicroERP.Api.DTOs;

public sealed class AtendimentoUpdateRequest
{
    [Required(ErrorMessage = "Status obrigatorio.")]
    [MaxLength(30, ErrorMessage = "Status deve ter no maximo 30 caracteres.")]
    public StatusAtendimento Status { get; set; }

    // Reagendamento (full-replace): envie o valor atual para mantê-lo.
    public DateTime? DataAgendada { get; set; }
}
