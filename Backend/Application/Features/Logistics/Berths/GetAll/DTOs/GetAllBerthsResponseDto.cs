namespace Application.Features.Logistics.Berths.GetAll.DTOs;

public class GetAllBerthsResponseDto
{
    public int Id { get; set; }

    public int TerminalId { get; set; }

    public string TerminalName { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public decimal? MaxDepth { get; set; }

    public decimal? MaxVesselLength { get; set; }

    public bool IsActive { get; set; }
}