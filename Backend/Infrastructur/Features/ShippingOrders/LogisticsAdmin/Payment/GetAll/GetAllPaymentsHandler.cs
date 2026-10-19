using Application.Features.Shipping.LogisticsAdmin.Payment.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Payment.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Payment.GetAll;

public class GetAllPaymentsHandler : IGetAllPaymentsHandler
{
    private readonly AppDbContext _dbContext;

    public GetAllPaymentsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetAllPaymentsResponseDto>> HandleAsync()
    {
        return await _dbContext.Payments
            .AsNoTracking()
            .OrderByDescending(payment => payment.CreatedAtUtc)
            .Select(payment => new GetAllPaymentsResponseDto
            {
                Id = payment.Id,

                InvoiceId = payment.InvoiceId,

                ShippingOrderId =
                    payment.Invoice.ShippingOrderId,

                CustomerId =
                    payment.Invoice.ShippingOrder.CustomerId,

                InvoiceNumber =
                    payment.Invoice.InvoiceNumber,

                CargoType =
                    payment.Invoice.ShippingOrder.CargoType,

                OriginPort =
                    payment.Invoice.ShippingOrder.OriginPort,

                DestinationPort =
                    payment.Invoice.ShippingOrder.DestinationPort,

                Amount = payment.Amount,

                Currency = payment.Currency,

                Status = (int)payment.Status,

                TransactionReference =
                    payment.TransactionReference,

                CreatedAtUtc = payment.CreatedAtUtc,

                PaidAtUtc = payment.PaidAtUtc,

                InvoiceStatus =
                    (int)payment.Invoice.Status,

                ShippingOrderStatus =
                    (int)payment.Invoice.ShippingOrder.Status
            })
            .ToListAsync();
    }
}