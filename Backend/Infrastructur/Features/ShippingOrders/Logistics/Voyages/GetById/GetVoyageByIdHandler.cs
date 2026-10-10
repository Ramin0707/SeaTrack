using Application.Features.Logistics.Voyages.GetById.DTOs;
using Application.Features.Logistics.Voyages.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Voyages.GetById;

public class GetVoyageByIdHandler : IGetVoyageByIdHandler
{
    private readonly AppDbContext _context;

    public GetVoyageByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetVoyageByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.Voyages
            .AsNoTracking()
            .Where(voyage => voyage.Id == id)
            .Select(voyage => new GetVoyageByIdResponseDto
            {
                Id = voyage.Id,
                VoyageNumber = voyage.VoyageNumber,

                VesselId = voyage.VesselId,
                VesselName = voyage.Vessel.Name,

                RouteId = voyage.RouteId,
                RouteName = voyage.Route.Name,

                EstimatedDepartureUtc = voyage.EstimatedDepartureUtc,
                EstimatedArrivalUtc = voyage.EstimatedArrivalUtc,

                ActualDepartureUtc = voyage.ActualDepartureUtc,
                ActualArrivalUtc = voyage.ActualArrivalUtc,

                IsActive = voyage.IsActive
            })
            .FirstOrDefaultAsync();
    }
}