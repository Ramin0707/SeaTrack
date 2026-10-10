using Application.Features.Logistics.Voyages.Create.DTOs;
using Application.Features.Logistics.Voyages.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Voyages.Create;

public class CreateVoyageHandler : ICreateVoyageHandler
{
    private readonly AppDbContext _context;

    public CreateVoyageHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateVoyageResponseDto?> HandleAsync(
        CreateVoyageRequestDto request)
    {
        if (request.EstimatedArrivalUtc <= request.EstimatedDepartureUtc)
            return null;

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
            .AnyAsync(voyage =>
                voyage.VoyageNumber == normalizedVoyageNumber);

        if (voyageNumberExists)
            return null;

        var voyage = new Voyage
        {
            VoyageNumber = normalizedVoyageNumber,
            VesselId = request.VesselId,
            RouteId = request.RouteId,
            EstimatedDepartureUtc = request.EstimatedDepartureUtc,
            EstimatedArrivalUtc = request.EstimatedArrivalUtc,
            ActualDepartureUtc = null,
            ActualArrivalUtc = null,
            IsActive = true
        };

        _context.Voyages.Add(voyage);
        await _context.SaveChangesAsync();

        return new CreateVoyageResponseDto
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