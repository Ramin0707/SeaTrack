using Application.Features.Shipping.Customer.Invoice.GetByOrderId.DTOs;
using Application.Features.Shipping.Customer.Invoice.GetByOrderId.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Invoice.GetByOrderId;

public class GetInvoiceByOrderIdHandler : IGetInvoiceByOrderIdHandler
{
    private readonly AppDbContext _dbContext;

    public GetInvoiceByOrderIdHandler(
        AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetInvoiceByOrderIdResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId)
    {
        var invoice = await _dbContext.Invoices
            .AsNoTracking()
            .Where(x =>
                x.ShippingOrderId == shippingOrderId &&
                x.ShippingOrder.CustomerId == customerId)
            .Select(x => new GetInvoiceByOrderIdResponseDto
            {
                Id = x.Id,
                ShippingOrderId = x.ShippingOrderId,
                QuoteId = x.QuoteId,
                InvoiceNumber = x.InvoiceNumber,
                Amount = x.Amount,
                Currency = x.Currency,
                Status = x.Status,
                IssuedAtUtc = x.IssuedAtUtc,
                DueDateUtc = x.DueDateUtc
            })
            .FirstOrDefaultAsync();

        return invoice;
    }
}