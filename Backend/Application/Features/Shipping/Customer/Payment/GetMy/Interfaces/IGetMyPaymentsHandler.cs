using Application.Features.Shipping.Customer.Payment.GetMy.DTOs;

namespace Application.Features.Shipping.Customer.Payment.GetMy.Interfaces;

public interface IGetMyPaymentsHandler
{
    Task<List<GetMyPaymentResponseDto>> HandleAsync(
        string customerId);
}