using Application.Features.Identity.Register.Interfaces;
using Application.Features.Identity.Register.DTOs;
using Infrastructur.Data;
using Infrastructur.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructur.Identity.Register
{
    public sealed class RegisterHandler : IRegisterHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;

        public RegisterHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            AppDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<RegisterResponseDto> HandleAsync(
            RegisterRequestDto request)
        {
            const string customerRole = "Customer";

            if (!await _roleManager.RoleExistsAsync(customerRole))
            {
                return new RegisterResponseDto
                {
                    Succeeded = false,
                    Errors = new[]
                    {
                        "Registration is temporarily unavailable."
                    }
                };
            }

            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            var user = new ApplicationUser
            {
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                UserName = request.Email.Trim()
            };

            var createResult = await _userManager.CreateAsync(
                user,
                request.Password);

            if (!createResult.Succeeded)
            {
                return new RegisterResponseDto
                {
                    Succeeded = false,
                    Errors = createResult.Errors
                        .Select(error => error.Description)
                        .ToArray()
                };
            }

            var roleResult = await _userManager.AddToRoleAsync(
                user,
                customerRole);

            if (!roleResult.Succeeded)
            {
                return new RegisterResponseDto
                {
                    Succeeded = false,
                    Errors = roleResult.Errors
                        .Select(error => error.Description)
                        .ToArray()
                };
            }

            await transaction.CommitAsync();

            return new RegisterResponseDto
            {
                Succeeded = true,
                UserId = user.Id
            };
        }
    }
}