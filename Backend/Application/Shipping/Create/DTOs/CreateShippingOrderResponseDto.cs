using Domain.Enums;

namespace Application.Features.ShippingOrders.Create.DTOs;

public class CreateShippingOrderResponseDto
{
    public int Id { get; set; }

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