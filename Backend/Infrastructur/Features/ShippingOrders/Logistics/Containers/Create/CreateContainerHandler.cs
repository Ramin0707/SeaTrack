using Application.Features.Logistics.Containers.Create.DTOs;
using Application.Features.Logistics.Containers.Create.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Containers.Create;

public class CreateContainerHandler : ICreateContainerHandler
{
    private readonly AppDbContext _context;

    public CreateContainerHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateContainerResponseDto?> HandleAsync(
        CreateContainerRequestDto request)
    {
        var normalizedContainerNumber = request.ContainerNumber
            .Trim()
            .ToUpperInvariant();

        var containerExists = await _context.Containers
            .AnyAsync(container =>
                container.ContainerNumber == normalizedContainerNumber);

        if (containerExists)
            return null;

        var container = new Container
        {
            ContainerNumber = normalizedContainerNumber,
            ContainerType = request.ContainerType,
            MaxWeight = request.MaxWeight,
            MaxVolume = request.MaxVolume,
            Status = ContainerStatus.Available,
            IsActive = true
        };

        _context.Containers.Add(container);

        await _context.SaveChangesAsync();

        return new CreateContainerResponseDto
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