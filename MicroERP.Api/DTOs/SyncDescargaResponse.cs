namespace MicroERP.Api.DTOs;

public sealed class SyncDescargaResponse
{
    public int AtendimentosImportados { get; set; }
    public int ClientesImportados { get; set; }
    public IReadOnlyList<string> Erros { get; set; } = [];
    public DateTime SincronizadoEm { get; set; }
}