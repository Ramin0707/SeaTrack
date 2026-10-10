namespace Application.Features.Logistics.PortCalls.GetAll.DTOs;

public class GetAllPortCallsResponseDto
{
    public int Id { get; set; }

    public int VoyageId { get; set; }

    public string VoyageNumber { get; set; } = string.Empty;

    public int PortId { get; set; }

    public string PortName { get; set; } = string.Empty;

    public int TerminalId { get; set; }

    public string TerminalName { get; set; } = string.Empty;

    public int BerthId { get; set; }

    public string BerthName { get; set; } = string.Empty;

    public DateTime EstimatedArrivalUtc { get; set; }

    public DateTime EstimatedDepartureUtc { get; set; }

    public DateTime? ActualArrivalUtc { get; set; }

    public DateTime? ActualDepartureUtc { get; set; }

    public bool IsActive { get; set; }
}