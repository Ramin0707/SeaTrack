namespace Application.Features.Logistics.Berths.Create.DTOs;

public class CreateBerthRequestDto
{
    public int TerminalId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public decimal? MaxDepth { get; set; }

    public decimal? MaxVesselLength { get; set; }
}