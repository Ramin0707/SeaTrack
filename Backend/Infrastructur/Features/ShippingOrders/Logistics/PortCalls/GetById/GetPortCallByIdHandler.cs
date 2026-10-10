using Application.Features.Logistics.PortCalls.GetById.DTOs;
using Application.Features.Logistics.PortCalls.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.PortCalls.GetById;

public class GetPortCallByIdHandler : IGetPortCallByIdHandler
{
    private readonly AppDbContext _context;

    public GetPortCallByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPortCallByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.PortCalls
            .AsNoTracking()
            .Where(portCall => portCall.Id == id)
            .Select(portCall => new GetPortCallByIdResponseDto
            {
                Id = portCall.Id,

                VoyageId = portCall.VoyageId,
                VoyageNumber = portCall.Voyage.VoyageNumber,

                PortId = portCall.PortId,
                PortName = portCall.Port.Name,

                TerminalId = portCall.TerminalId,
                TerminalName = portCall.Terminal.Name,

                BerthId = portCall.BerthId,
                BerthName = portCall.Berth.Name,

                EstimatedArrivalUtc = portCall.EstimatedArrivalUtc,
                EstimatedDepartureUtc = portCall.EstimatedDepartureUtc,

                ActualArrivalUtc = portCall.ActualArrivalUtc,
                ActualDepartureUtc = portCall.ActualDepartureUtc,

                IsActive = portCall.IsActive
            })
            .FirstOrDefaultAsync();
    }
}