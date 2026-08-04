namespace MicroERP.Api.Models
{
    public class Empresa
    {
        public long Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Documento { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


        // Navegações 
        public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

    }
}
