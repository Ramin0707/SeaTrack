namespace Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.DTOs;

public class GetCustomerResponseDto
{
    public string Id { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public bool EmailConfirmed { get; set; }

    public int ShippingOrdersCount { get; set; }
}