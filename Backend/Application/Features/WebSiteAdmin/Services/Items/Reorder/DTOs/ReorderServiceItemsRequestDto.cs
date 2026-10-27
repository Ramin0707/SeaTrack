namespace Application.Features.WebSiteAdmin.Services.Items.Reorder.DTOs;

public class ReorderServiceItemsRequestDto
{
    public List<ServiceItemOrderDto> Items { get; set; } = new();
}

public class ServiceItemOrderDto
{
    public int Id { get; set; }

    public int SortOrder { get; set; }
}