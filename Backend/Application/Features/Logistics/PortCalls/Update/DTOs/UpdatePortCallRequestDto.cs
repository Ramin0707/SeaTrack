namespace Application.Features.Logistics.PortCalls.Update.DTOs;

public class UpdatePortCallRequestDto
{
    public int VoyageId { get; set; }

    public int PortId { get; set; }

    public int TerminalId { get; set; }

    public int BerthId { get; set; }

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime? ActualArrivalUtc { get; set; }

    public DateTime? ActualDepartureUtc { get; set; }

    public bool IsActive { get; set; }
}