using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MicroERP.Api.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        // String temporária usada apenas para gerar migrations em design-time
        // Para aplicar no banco, Diego substitui pela connection string real do Supabase
        optionsBuilder.UseNpgsql("Host=localhost;Database=microerp;Username=postgres;Password=postgres");

        return new AppDbContext(optionsBuilder.Options);
    }
}