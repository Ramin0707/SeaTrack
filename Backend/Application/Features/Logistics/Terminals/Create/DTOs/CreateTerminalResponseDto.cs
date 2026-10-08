namespace Application.Features.Logistics.Terminals.Create.DTOs;

public class CreateTerminalResponseDto
{
    public int Id { get; set; }

    public int PortId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}