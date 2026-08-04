namespace MicroERP.Api.Enums
{
    public enum PerfilUsuario
    {
        // Valor neutro em 0: garante que um perfil nao-identificado nunca caia
        // acidentalmente em Dono (evita fail-open na autorizacao por perfil).
        Nenhum,
        Dono,
        Agente
    }
}
