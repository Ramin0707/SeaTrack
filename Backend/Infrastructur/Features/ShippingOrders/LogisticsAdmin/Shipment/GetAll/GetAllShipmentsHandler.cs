using Application.Features.Shipping.LogisticsAdmin.Shipment.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Shipment.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Shipment.GetAll;

public class GetAllShipmentsHandler : IGetAllShipmentsHandler
{
    private readonly AppDbContext _context;

    public GetAllShipmentsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllShipmentsResponseDto>> HandleAsync()
    {
        return await _context.Shipments
            .AsNoTracking()
            .OrderByDescending(shipment => shipment.CreatedAtUtc)
            .Select(shipment => new GetAllShipmentsResponseDto
            {
                ShipmentId = shipment.Id,
                ShippingOrderId = shipment.ShippingOrderId,
                TrackingNumber = shipment.TrackingNumber,
                Status = shipment.Status,
                CreatedAtUtc = shipment.CreatedAtUtc,
                LoadedAtUtc = shipment.LoadedAtUtc,
                ShippedAtUtc = shipment.ShippedAtUtc,
                ArrivedAtUtc = shipment.ArrivedAtUtc,
                UnloadedAtUtc = shipment.UnloadedAtUtc,
                DeliveredAtUtc = shipment.DeliveredAtUtc
            })
            .ToListAsync();
    }
}