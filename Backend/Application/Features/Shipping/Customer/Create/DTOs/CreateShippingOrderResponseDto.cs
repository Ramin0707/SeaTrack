using Domain.Enums;

namespace Application.Features.Shipping.Customer.Create.DTOs;

public class CreateShippingOrderResponseDto
{
    // Internal database ID.
    // Used for API operations and relationships.
    public int Id { get; set; }

    // Customer-facing order number.
    // Each customer has their own sequence: 1, 2, 3...
    public int CustomerOrderNumber { get; set; }

    public string CargoType { get; set; } = string.Empty;

    public decimal Weight { get; set; }

    public decimal Volume { get; set; }

    public string OriginPort { get; set; } = string.Empty;

    public string DestinationPort { get; set; } = string.Empty;

    public ContainerType ContainerType { get; set; }

    public DateTime DesiredShippingDate { get; set; }

    public ShippingOrderStatus Status { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}