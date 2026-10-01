using Application.Features.Identity.Login.DTOs;

namespace Application.Features.Identity.Login.Interfaces
{
    public interface ILoginHandler
    {
        Task<LoginResponseDto> HandleAsync(
            LoginRequestDto request);
    }
}