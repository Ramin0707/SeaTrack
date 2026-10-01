using Application.Features.Identity.Tokens.DTOs;

namespace Application.Features.Identity.Tokens.Interfaces
{
    public interface IJwtTokenService
    {
        TokenResponseDto CreateToken(
            string userId,
            IEnumerable<string> roles);
    }
}