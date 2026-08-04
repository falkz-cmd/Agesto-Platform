using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MicroERP.Api.Migrations
{
    /// <inheritdoc />
    public partial class ItemGenerico_ProdutoId_Nullable_Custo_Descricao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "ProdutoId",
                table: "ItemProdutos",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<decimal>(
                name: "Custo",
                table: "ItemProdutos",
                type: "numeric(12,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "ItemProdutos",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Custo",
                table: "ItemProdutos");

            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "ItemProdutos");

            // ATENCAO: rollback NAO e seguro depois que a feature for usada. Itens avulsos
            // (ProdutoId nulo) receberiam ProdutoId = 0 (FK invalida). So reverta se nao
            // houver itens avulsos gravados.
            migrationBuilder.AlterColumn<long>(
                name: "ProdutoId",
                table: "ItemProdutos",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);
        }
    }
}
