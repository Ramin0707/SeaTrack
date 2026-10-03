using Domain.Enums;

namespace Application.Features.Shipping.Customer.Cancel.DTOs;

public class CancelShippingOrderResponseDto
{
    public int Id { get; set; }

    public ShippingOrderStatus Status { get; set; }
}