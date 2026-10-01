using Application.Features.Identity.GetMe.DTOs;

namespace Application.Features.Identity.GetMe.Interfaces
{
    public interface IGetMeHandler
    {
        Task<GetMeResponseDto?> HandleAsync(string userId);
    }
}