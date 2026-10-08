namespace Application.Features.Logistics.Terminals.Update.DTOs;

public class UpdateTerminalRequestDto
{
    public int PortId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}