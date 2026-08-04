namespace MicroERP.Api.Services.Exceptions;

public sealed class CpfAlreadyExistsException : Exception
{
    public CpfAlreadyExistsException(string message) : base(message)
    {
    }
}
