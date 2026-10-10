namespace Application.Features.Logistics.Voyages.Update.DTOs;

public class UpdateVoyageRequestDto
{
    public string VoyageNumber { get; set; } = string.Empty;

    public int VesselId { get; set; }

    public int RouteId { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime? ActualDepartureUtc { get; set; }

    public DateTime? ActualArrivalUtc { get; set; }

    public bool IsActive { get; set; }
}