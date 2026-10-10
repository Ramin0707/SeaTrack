namespace Application.Features.Logistics.Routes.Create.DTOs;

public class CreateRouteResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public int OriginPortId { get; set; }

    public string OriginPortName { get; set; } = string.Empty;

    public int DestinationPortId { get; set; }

    public string DestinationPortName { get; set; } = string.Empty;

    public decimal DistanceNauticalMiles { get; set; }

    public int EstimatedTransitDays { get; set; }

    public bool IsActive { get; set; }
}