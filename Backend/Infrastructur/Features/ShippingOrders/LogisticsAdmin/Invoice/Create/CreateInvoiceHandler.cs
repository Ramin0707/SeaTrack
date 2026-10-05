using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Invoice.Create.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Invoice.Create;

public class CreateInvoiceHandler : ICreateInvoiceHandler
{
    private readonly AppDbContext _dbContext;

    public CreateInvoiceHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateInvoiceResponseDto?> HandleAsync(
        int shippingOrderId)
    {
        var shippingOrder = await _dbContext.ShippingOrders
            .FirstOrDefaultAsync(x => x.Id == shippingOrderId);

        if (shippingOrder is null)
        {
            return null;
        }

        if (shippingOrder.Status != ShippingOrderStatus.QuoteAccepted)
        {
            return null;
        }

        var quote = await _dbContext.Quotes
            .FirstOrDefaultAsync(x => x.ShippingOrderId == shippingOrderId);

        if (quote is null)
        {
            return null;
        }

        var existingInvoice = await _dbContext.Invoices
            .FirstOrDefaultAsync(x => x.ShippingOrderId == shippingOrderId);

        if (existingInvoice is not null)
        {
            return null;
        }

        var now = DateTime.UtcNow;

        var invoice = new Domain.Entities.Invoice
        {
            ShippingOrderId = shippingOrder.Id,
            QuoteId = quote.Id,
            InvoiceNumber = $"INV-{now:yyyyMMdd}-{shippingOrder.Id:D6}",
            Amount = quote.Price,
            Currency = quote.Currency,
            Status = InvoiceStatus.Pending,
            IssuedAtUtc = now,
            DueDateUtc = now.AddDays(7)
        };

        _dbContext.Invoices.Add(invoice);

        await _dbContext.SaveChangesAsync();

        return new CreateInvoiceResponseDto
        {
            Id = invoice.Id,
            ShippingOrderId = invoice.ShippingOrderId,
            QuoteId = invoice.QuoteId,
            InvoiceNumber = invoice.InvoiceNumber,
            Amount = invoice.Amount,
            Currency = invoice.Currency,
            Status = invoice.Status,
            IssuedAtUtc = invoice.IssuedAtUtc,
            DueDateUtc = invoice.DueDateUtc
        };
    }
}