namespace Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.DTOs;

public class TrackingPortCallDto
{
    public int PortCallId { get; set; }

    public string PortName { get; set; } = string.Empty;

    public string TerminalName { get; set; } = string.Empty;

    public string BerthName { get; set; } = string.Empty;

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime? ActualArrivalUtc { get; set; }

    public DateTime? ActualDepartureUtc { get; set; }
}