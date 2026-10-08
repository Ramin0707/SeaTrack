namespace Application.Features.Logistics.Terminals.GetAll.DTOs;

public class GetAllTerminalsResponseDto
{
    public int Id { get; set; }

    public int PortId { get; set; }

    public string PortName { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}