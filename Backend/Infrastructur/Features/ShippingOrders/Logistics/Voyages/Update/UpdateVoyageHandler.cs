using Application.Features.Logistics.Voyages.GetById.DTOs;
using Application.Features.Logistics.Voyages.Update.DTOs;
using Application.Features.Logistics.Voyages.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Voyages.Update;

public class UpdateVoyageHandler : IUpdateVoyageHandler
{
    private readonly AppDbContext _context;

    public UpdateVoyageHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetVoyageByIdResponseDto?> HandleAsync(
        int id,
        UpdateVoyageRequestDto request)
    {
        var voyage = await _context.Voyages
            .FirstOrDefaultAsync(voyage => voyage.Id == id);

        if (voyage is null)
            return null;

        if (request.EstimatedArrivalUtc <= request.EstimatedDepartureUtc)
            return null;

        if (request.ActualDepartureUtc.HasValue &&
            request.ActualArrivalUtc.HasValue &&
            request.ActualArrivalUtc <= request.ActualDepartureUtc)
        {
            return null;
        }

        var vessel = await _context.Vessels
            .FirstOrDefaultAsync(vessel =>
                vessel.Id == request.VesselId &&
                vessel.IsActive);

        if (vessel is null)
            return null;

        var route = await _context.Routes
            .FirstOrDefaultAsync(route =>
                route.Id == request.RouteId &&
                route.IsActive);

        if (route is null)
            return null;

        var normalizedVoyageNumber = request.VoyageNumber
            .Trim()
            .ToUpperInvariant();

        var voyageNumberExists = await _context.Voyages
            .AnyAsync(existingVoyage =>
                existingVoyage.Id != id &&
                existingVoyage.VoyageNumber == normalizedVoyageNumber);

        if (voyageNumberExists)
            return null;

        voyage.VoyageNumber = normalizedVoyageNumber;
        voyage.VesselId = request.VesselId;
        voyage.RouteId = request.RouteId;
        voyage.EstimatedDepartureUtc = request.EstimatedDepartureUtc;
        voyage.EstimatedArrivalUtc = request.EstimatedArrivalUtc;
        voyage.ActualDepartureUtc = request.ActualDepartureUtc;
        voyage.ActualArrivalUtc = request.ActualArrivalUtc;
        voyage.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new GetVoyageByIdResponseDto
        {
            Id = voyage.Id,
            VoyageNumber = voyage.VoyageNumber,

            VesselId = voyage.VesselId,
            VesselName = vessel.Name,

            RouteId = voyage.RouteId,
            RouteName = route.Name,

            EstimatedDepartureUtc = voyage.EstimatedDepartureUtc,
            EstimatedArrivalUtc = voyage.EstimatedArrivalUtc,

            ActualDepartureUtc = voyage.ActualDepartureUtc,
            ActualArrivalUtc = voyage.ActualArrivalUtc,

            IsActive = voyage.IsActive
        };
    }
}