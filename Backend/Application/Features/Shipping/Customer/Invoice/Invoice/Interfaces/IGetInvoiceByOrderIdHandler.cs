using Application.Features.Shipping.Customer.Invoice.GetByOrderId.DTOs;

namespace Application.Features.Shipping.Customer.Invoice.GetByOrderId.Interfaces;

public interface IGetInvoiceByOrderIdHandler
{
    Task<GetInvoiceByOrderIdResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId);
}