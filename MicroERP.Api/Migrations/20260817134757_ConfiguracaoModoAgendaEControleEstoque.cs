using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MicroERP.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConfiguracaoModoAgendaEControleEstoque : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ControlaEstoque",
                table: "Configuracoes",
                type: "boolean",
                nullable: false,
                // Preserva o comportamento atual (controle de estoque ligado)
                // para empresas ja existentes.
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "ModoAgendaAgente",
                table: "Configuracoes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ControlaEstoque",
                table: "Configuracoes");

            migrationBuilder.DropColumn(
                name: "ModoAgendaAgente",
                table: "Configuracoes");
        }
    }
}
