using Application.Features.Identity.GetMe.DTOs;
using Application.Features.Identity.GetMe.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Infrastructur.Identity.GetMe
{
    public sealed class GetMeHandler : IGetMeHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public GetMeHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<GetMeResponseDto?> HandleAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return null;
            }

            var roles = await _userManager.GetRolesAsync(user);

            return new GetMeResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Roles = roles.ToArray()
            };
        }
    }
}