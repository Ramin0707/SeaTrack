using Application.Features.Logistics.Routes.GetById.DTOs;
using Application.Features.Logistics.Routes.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Routes.GetById;

public class GetRouteByIdHandler : IGetRouteByIdHandler
{
    private readonly AppDbContext _context;

    public GetRouteByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetRouteByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.Routes
            .AsNoTracking()
            .Where(route => route.Id == id)
            .Select(route => new GetRouteByIdResponseDto
            {
                Id = route.Id,
                Name = route.Name,
                Code = route.Code,
                OriginPortId = route.OriginPortId,
                OriginPortName = route.OriginPort.Name,
                DestinationPortId = route.DestinationPortId,
                DestinationPortName = route.DestinationPort.Name,
                DistanceNauticalMiles = route.DistanceNauticalMiles,
                EstimatedTransitDays = route.EstimatedTransitDays,
                IsActive = route.IsActive
            })
            .FirstOrDefaultAsync();
    }
}