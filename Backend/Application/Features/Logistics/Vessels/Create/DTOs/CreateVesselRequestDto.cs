namespace Application.Features.Logistics.Vessels.Create.DTOs;

public class CreateVesselRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string ImoNumber { get; set; } = string.Empty;

    public string? CallSign { get; set; }

    public string Flag { get; set; } = string.Empty;

    public decimal Length { get; set; }

    public decimal Width { get; set; }

    public decimal MaxDraft { get; set; }

    public decimal DeadweightTonnage { get; set; }
}