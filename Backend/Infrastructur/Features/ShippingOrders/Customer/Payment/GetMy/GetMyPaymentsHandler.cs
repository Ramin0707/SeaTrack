using Application.Features.Shipping.Customer.Payment.GetMy.DTOs;
using Application.Features.Shipping.Customer.Payment.GetMy.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Payment.GetMy;

public class GetMyPaymentsHandler : IGetMyPaymentsHandler
{
    private readonly AppDbContext _dbContext;

    public GetMyPaymentsHandler(
        AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetMyPaymentResponseDto>> HandleAsync(
        string customerId)
    {
        return await _dbContext.Payments
            .AsNoTracking()
            .Where(x =>
                x.Invoice.ShippingOrder.CustomerId == customerId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new GetMyPaymentResponseDto
            {
                Id = x.Id,

                InvoiceId = x.InvoiceId,

                ShippingOrderId =
                    x.Invoice.ShippingOrderId,

                InvoiceNumber =
                    x.Invoice.InvoiceNumber,

                Amount = x.Amount,

                Currency = x.Currency,

                Status = x.Status,

                TransactionReference =
                    x.TransactionReference,

                CreatedAtUtc =
                    x.CreatedAtUtc,

                PaidAtUtc =
                    x.PaidAtUtc
            })
            .ToListAsync();
    }
}