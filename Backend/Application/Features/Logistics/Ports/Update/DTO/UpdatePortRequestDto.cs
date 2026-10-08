namespace Application.Features.Logistics.Ports.Update.DTOs;

public class UpdatePortRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}