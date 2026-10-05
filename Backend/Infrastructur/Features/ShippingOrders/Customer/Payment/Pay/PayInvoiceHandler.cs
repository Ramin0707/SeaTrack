using Application.Features.Shipping.Customer.Payment.Pay.DTOs;
using Application.Features.Shipping.Customer.Payment.Pay.Interfaces;
using Domain.Enums;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.Customer.Payment.Pay;

public class PayInvoiceHandler : IPayInvoiceHandler
{
    private readonly AppDbContext _dbContext;

    public PayInvoiceHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PayInvoiceResponseDto?> HandleAsync(
        int invoiceId,
        string customerId)
    {
        var invoice = await _dbContext.Invoices
            .Include(x => x.ShippingOrder)
            .FirstOrDefaultAsync(x =>
                x.Id == invoiceId &&
                x.ShippingOrder.CustomerId == customerId);

        if (invoice is null)
        {
            return null;
        }

        if (invoice.Status != InvoiceStatus.Pending)
        {
            return null;
        }

        if (invoice.ShippingOrder.Status != ShippingOrderStatus.QuoteAccepted)
        {
            return null;
        }

        var existingPayment = await _dbContext.Payments
            .FirstOrDefaultAsync(x => x.InvoiceId == invoiceId);

        if (existingPayment is not null)
        {
            return null;
        }

        var now = DateTime.UtcNow;

        var payment = new Domain.Entities.Payment
        {
            InvoiceId = invoice.Id,
            Amount = invoice.Amount,
            Currency = invoice.Currency,
            Status = PaymentStatus.Completed,
            TransactionReference = $"PAY-{now:yyyyMMddHHmmss}-{invoice.Id:D6}",
            CreatedAtUtc = now,
            PaidAtUtc = now
        };

        _dbContext.Payments.Add(payment);

        invoice.Status = InvoiceStatus.Paid;
        invoice.PaidAtUtc = now;

        invoice.ShippingOrder.Status = ShippingOrderStatus.Confirmed;

        await _dbContext.SaveChangesAsync();

        return new PayInvoiceResponseDto
        {
            PaymentId = payment.Id,
            InvoiceId = invoice.Id,
            ShippingOrderId = invoice.ShippingOrderId,
            Amount = payment.Amount,
            Currency = payment.Currency,
            PaymentStatus = payment.Status,
            InvoiceStatus = invoice.Status,
            ShippingOrderStatus = invoice.ShippingOrder.Status,
            TransactionReference = payment.TransactionReference ?? string.Empty,
            PaidAtUtc = payment.PaidAtUtc ?? now
        };
    }
}