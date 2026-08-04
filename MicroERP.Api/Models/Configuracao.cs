using MicroERP.Api.Enums;

namespace MicroERP.Api.Models;

public class Configuracao
{
    public long Id { get; set; }
    public TipoOperacao TipoOperacao { get; set; } = TipoOperacao.Hibrido;
    public long EmpresaId { get; set; }
    public Empresa? Empresa { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}
