namespace Application.Features.Logistics.Berths.Update.DTOs;

public class UpdateBerthRequestDto
{
    public int TerminalId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public decimal? MaxDepth { get; set; }

    public decimal? MaxVesselLength { get; set; }

    public bool IsActive { get; set; }
}