using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MicroERP.Api.Migrations
{
    /// <inheritdoc />
    public partial class ServicoItemSugerido : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServicoItemSugeridos",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmpresaId = table.Column<long>(type: "bigint", nullable: false),
                    ServicoId = table.Column<long>(type: "bigint", nullable: false),
                    ProdutoId = table.Column<long>(type: "bigint", nullable: false),
                    QuantidadePadrao = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicoItemSugeridos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServicoItemSugeridos_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ServicoItemSugeridos_Servicos_ServicoId",
                        column: x => x.ServicoId,
                        principalTable: "Servicos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServicoItemSugeridos_EmpresaId",
                table: "ServicoItemSugeridos",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_ServicoItemSugeridos_ProdutoId",
                table: "ServicoItemSugeridos",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_ServicoItemSugeridos_ServicoId_ProdutoId",
                table: "ServicoItemSugeridos",
                columns: new[] { "ServicoId", "ProdutoId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServicoItemSugeridos");
        }
    }
}
