using Application.Features.Logistics.Routes.GetById.DTOs;
using Application.Features.Logistics.Routes.Update.DTOs;
using Application.Features.Logistics.Routes.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Routes.Update;

public class UpdateRouteHandler : IUpdateRouteHandler
{
    private readonly AppDbContext _context;

    public UpdateRouteHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetRouteByIdResponseDto?> HandleAsync(
        int id,
        UpdateRouteRequestDto request)
    {
        var route = await _context.Routes
            .FirstOrDefaultAsync(route => route.Id == id);

        if (route is null)
            return null;

        if (request.OriginPortId == request.DestinationPortId)
            return null;

        var originPort = await _context.Ports
            .FirstOrDefaultAsync(port => port.Id == request.OriginPortId);

        if (originPort is null)
            return null;

        var destinationPort = await _context.Ports
            .FirstOrDefaultAsync(port => port.Id == request.DestinationPortId);

        if (destinationPort is null)
            return null;

        var normalizedCode = request.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.Routes
            .AnyAsync(existingRoute =>
                existingRoute.Id != id &&
                existingRoute.Code == normalizedCode);

        if (codeExists)
            return null;

        route.Name = request.Name.Trim();
        route.Code = normalizedCode;
        route.OriginPortId = request.OriginPortId;
        route.DestinationPortId = request.DestinationPortId;
        route.DistanceNauticalMiles = request.DistanceNauticalMiles;
        route.EstimatedTransitDays = request.EstimatedTransitDays;
        route.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new GetRouteByIdResponseDto
        {
            Id = route.Id,
            Name = route.Name,
            Code = route.Code,
            OriginPortId = route.OriginPortId,
            OriginPortName = originPort.Name,
            DestinationPortId = route.DestinationPortId,
            DestinationPortName = destinationPort.Name,
            DistanceNauticalMiles = route.DistanceNauticalMiles,
            EstimatedTransitDays = route.EstimatedTransitDays,
            IsActive = route.IsActive
        };
    }
}