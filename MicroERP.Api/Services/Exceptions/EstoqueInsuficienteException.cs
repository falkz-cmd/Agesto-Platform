namespace MicroERP.Api.Services.Exceptions;

public sealed class EstoqueInsuficienteException : Exception
{
    public EstoqueInsuficienteException(string nomeProduto)
        : base($"Estoque insuficiente para o produto '{nomeProduto}'.")
    {
    }
}