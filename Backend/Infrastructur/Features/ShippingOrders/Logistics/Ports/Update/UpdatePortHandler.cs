using Application.Features.Logistics.Ports.GetById.DTOs;
using Application.Features.Logistics.Ports.Update.DTOs;
using Application.Features.Logistics.Ports.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Ports.Update;

public class UpdatePortHandler : IUpdatePortHandler
{
    private readonly AppDbContext _context;

    public UpdatePortHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPortByIdResponseDto?> HandleAsync(
        int id,
        UpdatePortRequestDto request)
    {
        var port = await _context.Ports
            .FirstOrDefaultAsync(port => port.Id == id);

        if (port is null)
            return null;

        var normalizedCode = request.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.Ports
            .AnyAsync(port =>
                port.Id != id &&
                port.Code == normalizedCode);

        if (codeExists)
            return null;

        port.Name = request.Name.Trim();
        port.Code = normalizedCode;
        port.Country = request.Country.Trim();
        port.City = request.City.Trim();
        port.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new GetPortByIdResponseDto
        {
            Id = port.Id,
            Name = port.Name,
            Code = port.Code,
            Country = port.Country,
            City = port.City,
            IsActive = port.IsActive
        };
    }
}