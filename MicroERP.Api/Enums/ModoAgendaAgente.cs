namespace MicroERP.Api.Enums
{
    /// <summary>
    /// Controla se o agente (mobile) pode criar/agendar atendimentos futuros.
    /// Flexivel: prestador solo registra e agenda em campo.
    /// Fixa: equipe segue a agenda montada pelo Dono (walk-in ainda liberado).
    /// </summary>
    public enum ModoAgendaAgente { Flexivel, Fixa }
}
