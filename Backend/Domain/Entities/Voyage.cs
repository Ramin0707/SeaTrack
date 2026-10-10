namespace Domain.Entities;

public class Voyage : BaseEntity
{
    public string VoyageNumber { get; set; } = string.Empty;

    public int VesselId { get; set; }

    public int RouteId { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime? ActualDepartureUtc { get; set; }

    public DateTime? ActualArrivalUtc { get; set; }

    public bool IsActive { get; set; } = true;

    public Vessel Vessel { get; set; } = null!;

    public Route Route { get; set; } = null!;
}