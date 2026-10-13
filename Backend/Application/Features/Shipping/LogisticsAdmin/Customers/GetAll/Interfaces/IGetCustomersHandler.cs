using Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.Interfaces;

public interface IGetCustomersHandler
{
    Task<List<GetCustomerResponseDto>> HandleAsync(
        string? search,
        bool? emailConfirmed);
}