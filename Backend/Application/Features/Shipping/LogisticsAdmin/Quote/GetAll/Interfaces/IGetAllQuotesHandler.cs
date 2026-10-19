using Application.Features.Shipping.LogisticsAdmin.Quote.GetAll.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Quote.GetAll.Interfaces;

public interface IGetAllQuotesHandler
{
    Task<List<GetAllQuotesResponseDto>> HandleAsync();
}