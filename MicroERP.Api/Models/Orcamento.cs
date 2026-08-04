using MicroERP.Api.Enums;

namespace MicroERP.Api.Models;

public class Orcamento
{
    public long Id { get; set; }
    public Guid Uuid { get; set; }
    public long EmpresaId { get; set; }
    public long UsuarioId { get; set; }
    public long ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public StatusOrcamento Status { get; set; } = StatusOrcamento.Rascunho;
    public decimal ValorTotal { get; set; }
    public DateTime DataRegistro { get; set; }
    // Preenchido quando o orcamento e convertido em Atendimento (DEC-16).
    public long? AtendimentoConvertidoId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SyncedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<ItemOrcamento> Itens { get; set; } = new List<ItemOrcamento>();
}
