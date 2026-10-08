using Application.Features.Logistics.Vessels.GetById.DTOs;
using Application.Features.Logistics.Vessels.Update.DTOs;
using Application.Features.Logistics.Vessels.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Vessels.Update;

public class UpdateVesselHandler : IUpdateVesselHandler
{
    private readonly AppDbContext _context;

    public UpdateVesselHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetVesselByIdResponseDto?> HandleAsync(
        int id,
        UpdateVesselRequestDto request)
    {
        var vessel = await _context.Vessels
            .FirstOrDefaultAsync(vessel => vessel.Id == id);

        if (vessel is null)
            return null;

        var normalizedImoNumber = request.ImoNumber
            .Trim()
            .ToUpperInvariant();

        var imoExists = await _context.Vessels
            .AnyAsync(vessel =>
                vessel.Id != id &&
                vessel.ImoNumber == normalizedImoNumber);

        if (imoExists)
            return null;

        vessel.Name = request.Name.Trim();
        vessel.ImoNumber = normalizedImoNumber;
        vessel.CallSign = string.IsNullOrWhiteSpace(request.CallSign)
            ? null
            : request.CallSign.Trim().ToUpperInvariant();
        vessel.Flag = request.Flag.Trim();
        vessel.Length = request.Length;
        vessel.Width = request.Width;
        vessel.MaxDraft = request.MaxDraft;
        vessel.DeadweightTonnage = request.DeadweightTonnage;
        vessel.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new GetVesselByIdResponseDto
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