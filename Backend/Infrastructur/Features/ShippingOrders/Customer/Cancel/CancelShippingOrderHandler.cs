using Application.Features.Shipping.Customer.Cancel.DTOs;
using Application.Features.Shipping.Customer.Cancel.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Cancel;

public class CancelShippingOrderHandler : ICancelShippingOrderHandler
{
    private readonly AppDbContext _dbContext;

    public CancelShippingOrderHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CancelShippingOrderResponseDto?> HandleAsync(
        int id,
        string customerId)
    {
        var shippingOrder = await _dbContext.ShippingOrders
            .FirstOrDefaultAsync(order =>
                order.Id == id &&
                order.CustomerId == customerId);

        if (shippingOrder is null)
        {
            return null;
        }

        if (shippingOrder.Status != ShippingOrderStatus.AwaitingQuote)
        {
            return null;
        }

        shippingOrder.Status = ShippingOrderStatus.Cancelled;

        await _dbContext.SaveChangesAsync();

        return new CancelShippingOrderResponseDto
        {
            Id = shippingOrder.Id,
            Status = shippingOrder.Status
        };
    }
}