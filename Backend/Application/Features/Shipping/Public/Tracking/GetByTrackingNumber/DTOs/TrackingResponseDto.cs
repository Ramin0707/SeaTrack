using Domain.Enums;

namespace Application.Features.Shipping.Public.Tracking.GetByTrackingNumber.DTOs;

public class TrackingResponseDto
{
    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus Status { get; set; }

    public string OriginPort { get; set; } = string.Empty;

    public string DestinationPort { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? LoadedAtUtc { get; set; }

    public DateTime? ShippedAtUtc { get; set; }

    public DateTime? ArrivedAtUtc { get; set; }

    public DateTime? UnloadedAtUtc { get; set; }

    public DateTime? DeliveredAtUtc { get; set; }
    public List<TrackingPortCallDto> PortCalls { get; set; } = new();
}