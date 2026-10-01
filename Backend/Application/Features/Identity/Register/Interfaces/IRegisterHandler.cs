using Application.Features.Identity.Register.DTOs;

namespace Application.Features.Identity.Register.Interfaces
{
    public interface IRegisterHandler
    {
        Task<RegisterResponseDto> HandleAsync(
            RegisterRequestDto request);
    }
}