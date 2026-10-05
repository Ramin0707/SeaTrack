using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Invoice.Create.Interfaces;

public interface ICreateInvoiceHandler
{
    Task<CreateInvoiceResponseDto?> HandleAsync(
        int shippingOrderId);
}