namespace Application.Features.Shipping.LogisticsAdmin.Quote.Create.DTOs;

public class CreateQuoteRequestDto
{
    public decimal Price { get; set; }

    public string Currency { get; set; } = "USD";

    public int EstimatedTransitDays { get; set; }

    public DateTime ValidUntil { get; set; }

    public string? Notes { get; set; }
}