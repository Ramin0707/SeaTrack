namespace Application.Features.Logistics.Terminals.Create.DTOs;

public class CreateTerminalRequestDto
{
    public int PortId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;
}