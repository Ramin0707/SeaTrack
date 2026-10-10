using Application.Features.Logistics.PortCalls.GetById.DTOs;
using Application.Features.Logistics.PortCalls.Update.DTOs;
using Application.Features.Logistics.PortCalls.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.PortCalls.Update;

public class UpdatePortCallHandler : IUpdatePortCallHandler
{
    private readonly AppDbContext _context;

    public UpdatePortCallHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPortCallByIdResponseDto?> HandleAsync(
        int id,
        UpdatePortCallRequestDto request)
    {
        var portCall = await _context.PortCalls
            .FirstOrDefaultAsync(portCall => portCall.Id == id);

        if (portCall is null)
            return null;

        if (request.EstimatedDepartureUtc <= request.EstimatedArrivalUtc)
            return null;

        if (request.ActualArrivalUtc.HasValue &&
            request.ActualDepartureUtc.HasValue &&
            request.ActualDepartureUtc <= request.ActualArrivalUtc)
        {
            return null;
        }

        var voyage = await _context.Voyages
            .FirstOrDefaultAsync(voyage =>
                voyage.Id == request.VoyageId &&
                voyage.IsActive);

        if (voyage is null)
            return null;

        var port = await _context.Ports
            .FirstOrDefaultAsync(port =>
                port.Id == request.PortId &&
                port.IsActive);

        if (port is null)
            return null;

        var terminal = await _context.Terminals
            .FirstOrDefaultAsync(terminal =>
                terminal.Id == request.TerminalId &&
                terminal.PortId == request.PortId &&
                terminal.IsActive);

        if (terminal is null)
            return null;

        var berth = await _context.Berths
            .FirstOrDefaultAsync(berth =>
                berth.Id == request.BerthId &&
                berth.TerminalId == request.TerminalId &&
                berth.IsActive);

        if (berth is null)
            return null;

        var berthConflict = await _context.PortCalls
            .AnyAsync(existingPortCall =>
                existingPortCall.Id != id &&
                existingPortCall.BerthId == request.BerthId &&
                existingPortCall.IsActive &&
                existingPortCall.EstimatedArrivalUtc < request.EstimatedDepartureUtc &&
                request.EstimatedArrivalUtc < existingPortCall.EstimatedDepartureUtc);

        if (berthConflict)
            return null;

        portCall.VoyageId = request.VoyageId;
        portCall.PortId = request.PortId;
        portCall.TerminalId = request.TerminalId;
        portCall.BerthId = request.BerthId;

        portCall.EstimatedArrivalUtc = request.EstimatedArrivalUtc;
        portCall.EstimatedDepartureUtc = request.EstimatedDepartureUtc;

        portCall.ActualArrivalUtc = request.ActualArrivalUtc;
        portCall.ActualDepartureUtc = request.ActualDepartureUtc;

        portCall.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new GetPortCallByIdResponseDto
        {
            Id = portCall.Id,

            VoyageId = portCall.VoyageId,
            VoyageNumber = voyage.VoyageNumber,

            PortId = portCall.PortId,
            PortName = port.Name,

            TerminalId = portCall.TerminalId,
            TerminalName = terminal.Name,

            BerthId = portCall.BerthId,
            BerthName = berth.Name,

            EstimatedArrivalUtc = portCall.EstimatedArrivalUtc,
            EstimatedDepartureUtc = portCall.EstimatedDepartureUtc,

            ActualArrivalUtc = portCall.ActualArrivalUtc,
            ActualDepartureUtc = portCall.ActualDepartureUtc,

            IsActive = portCall.IsActive
        };
    }
}