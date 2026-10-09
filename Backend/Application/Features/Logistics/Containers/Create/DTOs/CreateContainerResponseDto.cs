using Domain.Enums;

namespace Application.Features.Logistics.Containers.Create.DTOs;

public class CreateContainerResponseDto
{
    public int Id { get; set; }

    public string ContainerNumber { get; set; } = string.Empty;

    public ContainerType ContainerType { get; set; }

    public decimal MaxWeight { get; set; }

    public decimal MaxVolume { get; set; }

    public ContainerStatus Status { get; set; }

    public bool IsActive { get; set; }
}