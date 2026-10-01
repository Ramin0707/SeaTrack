using Application.Features.Identity.Login.DTOs;
using Application.Features.Identity.Login.Interfaces;
using Application.Features.Identity.Tokens.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Infrastructur.Identity.Login
{
    public sealed class LoginHandler : ILoginHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenService _jwtTokenService;

        public LoginHandler(
            UserManager<ApplicationUser> userManager,
            IJwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<LoginResponseDto> HandleAsync(
            LoginRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(
                request.Email.Trim());

            if (user is null)
            {
                return LoginFailed();
            }

            if (await _userManager.IsLockedOutAsync(user))
            {
                return LoginFailed();
            }

            var passwordIsValid = await _userManager.CheckPasswordAsync(
                user,
                request.Password);

            if (!passwordIsValid)
            {
                var failedAttemptResult =
                    await _userManager.AccessFailedAsync(user);

                if (!failedAttemptResult.Succeeded)
                {
                    return LoginFailed();
                }

                return LoginFailed();
            }

            // A separate verification step is required for 2FA accounts.
            if (await _userManager.GetTwoFactorEnabledAsync(user))
            {
                return LoginFailed();
            }

            var resetResult =
                await _userManager.ResetAccessFailedCountAsync(user);

            if (!resetResult.Succeeded)
            {
                return LoginFailed();
            }

            var roles = await _userManager.GetRolesAsync(user);

            var token = _jwtTokenService.CreateToken(user.Id, roles);

            return new LoginResponseDto
            {
                Succeeded = true,
                AccessToken = token.AccessToken,
                ExpiresAtUtc = token.ExpiresAtUtc
            };
        }

        private static LoginResponseDto LoginFailed()
        {
            return new LoginResponseDto
            {
                Succeeded = false,
                Errors = new[]
                {
                    "Unable to sign in. Check your credentials or try again later."
                }
            };
        }
    }
}