namespace Application.Features.Logistics.Voyages.Create.DTOs;

public class CreateVoyageRequestDto
{
    public string VoyageNumber { get; set; } = string.Empty;

    public int VesselId { get; set; }

    public int RouteId { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime EstimatedArrivalUtc { get; set; }
}