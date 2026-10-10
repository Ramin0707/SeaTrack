namespace Application.Features.Logistics.Voyages.Create.DTOs;

public class CreateVoyageResponseDto
{
    public int Id { get; set; }

    public string VoyageNumber { get; set; } = string.Empty;

    public int VesselId { get; set; }

    public string VesselName { get; set; } = string.Empty;

    public int RouteId { get; set; }

    public string RouteName { get; set; } = string.Empty;

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime? ActualDepartureUtc { get; set; }

    public DateTime? ActualArrivalUtc { get; set; }

    public bool IsActive { get; set; }
}