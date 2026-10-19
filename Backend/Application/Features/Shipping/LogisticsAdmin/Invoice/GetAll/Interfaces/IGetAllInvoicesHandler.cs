using Application.Features.Shipping.LogisticsAdmin.Invoice.GetAll.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Invoice.GetAll.Interfaces;

public interface IGetAllInvoicesHandler
{
    Task<List<GetAllInvoicesResponseDto>> HandleAsync();
}