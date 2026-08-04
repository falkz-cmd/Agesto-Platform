namespace MicroERP.Api.DTOs;

public sealed class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public IReadOnlyList<string> Errors { get; set; } = Array.Empty<string>();
}
