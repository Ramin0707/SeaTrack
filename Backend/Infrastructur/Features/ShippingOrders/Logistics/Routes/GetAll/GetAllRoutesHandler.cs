using Application.Features.Logistics.Routes.GetAll.DTOs;
using Application.Features.Logistics.Routes.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Routes.GetAll;

public class GetAllRoutesHandler : IGetAllRoutesHandler
{
    private readonly AppDbContext _context;

    public GetAllRoutesHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllRoutesResponseDto>> HandleAsync()
    {
        return await _context.Routes
            .AsNoTracking()
            .OrderBy(route => route.Name)
            .Select(route => new GetAllRoutesResponseDto
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
            .ToListAsync();
    }
}