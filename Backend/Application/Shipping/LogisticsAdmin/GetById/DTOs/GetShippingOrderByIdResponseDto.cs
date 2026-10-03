using Domain.Enums;

namespace Application.Features.Shipping.LogisticsAdmin.GetById.DTOs;

public class GetShippingOrderByIdResponseDto
{
    public int Id { get; set; }

    public string CustomerId { get; set; } = string.Empty;

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