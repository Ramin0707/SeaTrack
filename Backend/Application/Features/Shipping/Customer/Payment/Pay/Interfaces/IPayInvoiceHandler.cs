using Application.Features.Shipping.Customer.Payment.Pay.DTOs;

namespace Application.Features.Shipping.Customer.Payment.Pay.Interfaces;

public interface IPayInvoiceHandler
{
    Task<PayInvoiceResponseDto?> HandleAsync(
        int invoiceId,
        string customerId);
}