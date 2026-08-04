using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MicroERP.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConvertEnumsToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Schema already applied manually to Supabase before this migration was generated.
            // This migration exists only to sync EF Core migration history.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Atendimentos_Empresas_EmpresaId",
                table: "Atendimentos");

            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Empresas_EmpresaId",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Configuracoes_Empresas_EmpresaId",
                table: "Configuracoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Produtos_Empresas_EmpresaId",
                table: "Produtos");

            migrationBuilder.DropForeignKey(
                name: "FK_Servicos_Empresas_EmpresaId",
                table: "Servicos");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Empresas_EmpresaId",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "Empresas");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_EmpresaId",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Atendimentos_EmpresaId",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "EmpresaId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Perfil",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "TipoCobranca",
                table: "Servicos");

            migrationBuilder.DropColumn(
                name: "ValorEmpreitada",
                table: "Servicos");

            migrationBuilder.DropColumn(
                name: "EmpresaId",
                table: "Atendimentos");

            migrationBuilder.RenameColumn(
                name: "EmpresaId",
                table: "Servicos",
                newName: "UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Servicos_EmpresaId",
                table: "Servicos",
                newName: "IX_Servicos_UsuarioId");

            migrationBuilder.RenameColumn(
                name: "EmpresaId",
                table: "Produtos",
                newName: "UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Produtos_EmpresaId",
                table: "Produtos",
                newName: "IX_Produtos_UsuarioId");

            migrationBuilder.RenameColumn(
                name: "EmpresaId",
                table: "Configuracoes",
                newName: "UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Configuracoes_EmpresaId",
                table: "Configuracoes",
                newName: "IX_Configuracoes_UsuarioId");

            migrationBuilder.RenameColumn(
                name: "EmpresaId",
                table: "Clientes",
                newName: "UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Clientes_EmpresaId_Cpf",
                table: "Clientes",
                newName: "IX_Clientes_UsuarioId_Cpf");

            migrationBuilder.RenameIndex(
                name: "IX_Clientes_EmpresaId",
                table: "Clientes",
                newName: "IX_Clientes_UsuarioId");

            migrationBuilder.AlterColumn<decimal>(
                name: "ValorHora",
                table: "Servicos",
                type: "numeric(12,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(12,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AiApiKey",
                table: "Configuracoes",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AiEnabled",
                table: "Configuracoes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "AiProvider",
                table: "Configuracoes",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Configuracoes_Usuarios_UsuarioId",
                table: "Configuracoes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}