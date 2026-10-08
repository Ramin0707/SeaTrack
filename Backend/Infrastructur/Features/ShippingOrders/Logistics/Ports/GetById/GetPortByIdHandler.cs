using Application.Features.Logistics.Ports.GetById.DTOs;
using Application.Features.Logistics.Ports.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Ports.GetById;

public class GetPortByIdHandler : IGetPortByIdHandler
{
    private readonly AppDbContext _context;

    public GetPortByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPortByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.Ports
            .AsNoTracking()
            .Where(port => port.Id == id)
            .Select(port => new GetPortByIdResponseDto
            {
                Id = port.Id,
                Name = port.Name,
                Code = port.Code,
                Country = port.Country,
                City = port.City,
                IsActive = port.IsActive
            })
            .FirstOrDefaultAsync();
    }
}