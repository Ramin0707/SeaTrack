namespace Application.Features.Logistics.Ports.GetById.DTOs;

public class GetPortByIdResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}