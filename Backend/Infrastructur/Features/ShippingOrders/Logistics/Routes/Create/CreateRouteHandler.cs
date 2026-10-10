using Application.Features.Logistics.Routes.Create.DTOs;
using Application.Features.Logistics.Routes.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Routes.Create;

public class CreateRouteHandler : ICreateRouteHandler
{
    private readonly AppDbContext _context;

    public CreateRouteHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateRouteResponseDto?> HandleAsync(
        CreateRouteRequestDto request)
    {
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
            .AnyAsync(route => route.Code == normalizedCode);

        if (codeExists)
            return null;

        var route = new Route
        {
            Name = request.Name.Trim(),
            Code = normalizedCode,
            OriginPortId = request.OriginPortId,
            DestinationPortId = request.DestinationPortId,
            DistanceNauticalMiles = request.DistanceNauticalMiles,
            EstimatedTransitDays = request.EstimatedTransitDays,
            IsActive = true
        };

        _context.Routes.Add(route);

        await _context.SaveChangesAsync();

        return new CreateRouteResponseDto
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