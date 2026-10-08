namespace Application.Features.Logistics.Ports.Create.DTOs;

public class CreatePortRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;
}