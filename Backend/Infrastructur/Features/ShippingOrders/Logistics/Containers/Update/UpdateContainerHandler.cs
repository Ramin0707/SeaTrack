using Application.Features.Logistics.Containers.GetById.DTOs;
using Application.Features.Logistics.Containers.Update.DTOs;
using Application.Features.Logistics.Containers.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Containers.Update;

public class UpdateContainerHandler : IUpdateContainerHandler
{
    private readonly AppDbContext _context;

    public UpdateContainerHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetContainerByIdResponseDto?> HandleAsync(
        int id,
        UpdateContainerRequestDto request)
    {
        var container = await _context.Containers
            .FirstOrDefaultAsync(container => container.Id == id);

        if (container is null)
            return null;

        var normalizedContainerNumber = request.ContainerNumber
            .Trim()
            .ToUpperInvariant();

        var containerNumberExists = await _context.Containers
            .AnyAsync(container =>
                container.Id != id &&
                container.ContainerNumber == normalizedContainerNumber);

        if (containerNumberExists)
            return null;

        container.ContainerNumber = normalizedContainerNumber;
        container.ContainerType = request.ContainerType;
        container.MaxWeight = request.MaxWeight;
        container.MaxVolume = request.MaxVolume;
        container.Status = request.Status;
        container.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new GetContainerByIdResponseDto
        {
            Id = container.Id,
            ContainerNumber = container.ContainerNumber,
            ContainerType = container.ContainerType,
            MaxWeight = container.MaxWeight,
            MaxVolume = container.MaxVolume,
            Status = container.Status,
            IsActive = container.IsActive
        };
    }
}