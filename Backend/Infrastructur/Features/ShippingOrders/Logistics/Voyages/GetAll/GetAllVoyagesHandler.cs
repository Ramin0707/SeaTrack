using Application.Features.Logistics.Voyages.GetAll.DTOs;
using Application.Features.Logistics.Voyages.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Voyages.GetAll;

public class GetAllVoyagesHandler : IGetAllVoyagesHandler
{
    private readonly AppDbContext _context;

    public GetAllVoyagesHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllVoyagesResponseDto>> HandleAsync()
    {
        return await _context.Voyages
            .AsNoTracking()
            .OrderBy(voyage => voyage.EstimatedDepartureUtc)
            .Select(voyage => new GetAllVoyagesResponseDto
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
            .ToListAsync();
    }
}