namespace Domain.Enums;

public enum ShippingOrderStatus
{
    AwaitingQuote = 1,
    QuoteProvided = 2,
    QuoteAccepted = 3,
    QuoteRejected = 4,
    Confirmed = 5,
    InTransit = 6,
    Delivered = 7,
    Cancelled = 8
}