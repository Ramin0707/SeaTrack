using Application.Features.ShippingOrders.LogisticsAdmin.Assignment.DTOs;
using Application.Features.ShippingOrders.LogisticsAdmin.Assignment.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Assignment;

public class AssignShippingOrderHandler : IAssignShippingOrderHandler
{
    private readonly AppDbContext _context;

    public AssignShippingOrderHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(
        int orderId,
        AssignShippingOrderRequestDto request)
    {
        var order = await _context.ShippingOrders
            .FirstOrDefaultAsync(order => order.Id == orderId);

        if (order is null)
            return false;

        if (order.Status != ShippingOrderStatus.Confirmed)
            return false;

        var container = await _context.Containers
            .FirstOrDefaultAsync(container =>
                container.Id == request.ContainerId &&
                container.IsActive &&
                container.Status == ContainerStatus.Available);

        if (container is null)
            return false;

        var voyage = await _context.Voyages
            .FirstOrDefaultAsync(voyage =>
                voyage.Id == request.VoyageId &&
                voyage.IsActive);

        if (voyage is null)
            return false;

        var containerAlreadyAssigned = await _context.ShippingOrders
            .AnyAsync(existingOrder =>
                existingOrder.Id != orderId &&
                existingOrder.ContainerId == request.ContainerId &&
                existingOrder.Status != ShippingOrderStatus.Cancelled &&
                existingOrder.Status != ShippingOrderStatus.Delivered);

        if (containerAlreadyAssigned)
            return false;

        order.ContainerId = container.Id;
        order.VoyageId = voyage.Id;

        container.Status = ContainerStatus.Reserved;

        await _context.SaveChangesAsync();

        return true;
    }
}