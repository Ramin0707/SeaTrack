using Application.Features.Logistics.Vessels.Create.DTOs;
using Application.Features.Logistics.Vessels.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Vessels.Create;

public class CreateVesselHandler : ICreateVesselHandler
{
    private readonly AppDbContext _context;

    public CreateVesselHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateVesselResponseDto?> HandleAsync(
        CreateVesselRequestDto request)
    {
        var normalizedImoNumber = request.ImoNumber
            .Trim()
            .ToUpperInvariant();

        var imoExists = await _context.Vessels
            .AnyAsync(vessel =>
                vessel.ImoNumber == normalizedImoNumber);

        if (imoExists)
            return null;

        var vessel = new Vessel
        {
            Name = request.Name.Trim(),
            ImoNumber = normalizedImoNumber,
            CallSign = string.IsNullOrWhiteSpace(request.CallSign)
                ? null
                : request.CallSign.Trim().ToUpperInvariant(),
            Flag = request.Flag.Trim(),
            Length = request.Length,
            Width = request.Width,
            MaxDraft = request.MaxDraft,
            DeadweightTonnage = request.DeadweightTonnage,
            IsActive = true
        };

        _context.Vessels.Add(vessel);

        await _context.SaveChangesAsync();

        return new CreateVesselResponseDto
        {
            Id = vessel.Id,
            Name = vessel.Name,
            ImoNumber = vessel.ImoNumber,
            CallSign = vessel.CallSign,
            Flag = vessel.Flag,
            Length = vessel.Length,
            Width = vessel.Width,
            MaxDraft = vessel.MaxDraft,
            DeadweightTonnage = vessel.DeadweightTonnage,
            IsActive = vessel.IsActive
        };
    }
}