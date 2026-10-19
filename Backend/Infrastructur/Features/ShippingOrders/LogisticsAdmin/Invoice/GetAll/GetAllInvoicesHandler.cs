using Application.Features.Shipping.LogisticsAdmin.Invoice.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Invoice.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Invoice.GetAll;

public class GetAllInvoicesHandler : IGetAllInvoicesHandler
{
    private readonly AppDbContext _dbContext;

    public GetAllInvoicesHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetAllInvoicesResponseDto>> HandleAsync()
    {
        return await _dbContext.Invoices
            .AsNoTracking()
            .OrderByDescending(invoice => invoice.IssuedAtUtc)
            .Select(invoice => new GetAllInvoicesResponseDto
            {
                Id = invoice.Id,

                ShippingOrderId = invoice.ShippingOrderId,

                QuoteId = invoice.QuoteId,

                CustomerId = invoice.ShippingOrder.CustomerId,

                CargoType = invoice.ShippingOrder.CargoType,

                OriginPort = invoice.ShippingOrder.OriginPort,

                DestinationPort = invoice.ShippingOrder.DestinationPort,

                InvoiceNumber = invoice.InvoiceNumber,

                Amount = invoice.Amount,

                Currency = invoice.Currency,

                Status = (int)invoice.Status,

                IssuedAtUtc = invoice.IssuedAtUtc,

                DueDateUtc = invoice.DueDateUtc,

                ShippingOrderStatus =
                    (int)invoice.ShippingOrder.Status
            })
            .ToListAsync();
    }
}