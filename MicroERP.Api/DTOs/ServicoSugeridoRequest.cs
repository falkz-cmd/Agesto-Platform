using System.ComponentModel.DataAnnotations;

namespace MicroERP.Api.DTOs;

/// <summary>Um material sugerido no PUT do kit de um serviço (a requisição envia uma lista).</summary>
public sealed class ServicoSugeridoRequest
{
    [Range(1, long.MaxValue, ErrorMessage = "Produto invalido.")]
    public long ProdutoId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantidade padrao invalida.")]
    public int QuantidadePadrao { get; set; }
}
