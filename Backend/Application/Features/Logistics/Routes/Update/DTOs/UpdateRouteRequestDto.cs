namespace Application.Features.Logistics.Routes.Update.DTOs;

public class UpdateRouteRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public int OriginPortId { get; set; }

    public int DestinationPortId { get; set; }

    public decimal DistanceNauticalMiles { get; set; }

    public int EstimatedTransitDays { get; set; }

    public bool IsActive { get; set; }
}