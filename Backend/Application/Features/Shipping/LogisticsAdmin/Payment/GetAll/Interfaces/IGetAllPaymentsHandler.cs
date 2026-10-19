using Application.Features.Shipping.LogisticsAdmin.Payment.GetAll.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Payment.GetAll.Interfaces;

public interface IGetAllPaymentsHandler
{
    Task<List<GetAllPaymentsResponseDto>> HandleAsync();
}