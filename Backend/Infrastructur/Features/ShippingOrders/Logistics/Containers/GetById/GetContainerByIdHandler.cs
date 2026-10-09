using Application.Features.Logistics.Containers.GetById.DTOs;
using Application.Features.Logistics.Containers.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Containers.GetById;

public class GetContainerByIdHandler : IGetContainerByIdHandler
{
    private readonly AppDbContext _context;

    public GetContainerByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetContainerByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.Containers
            .AsNoTracking()
            .Where(container => container.Id == id)
            .Select(container => new GetContainerByIdResponseDto
            {
                Id = container.Id,
                ContainerNumber = container.ContainerNumber,
                ContainerType = container.ContainerType,
                MaxWeight = container.MaxWeight,
                MaxVolume = container.MaxVolume,
                Status = container.Status,
                IsActive = container.IsActive
            })
            .FirstOrDefaultAsync();
    }
}