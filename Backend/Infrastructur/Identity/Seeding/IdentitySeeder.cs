using Microsoft.AspNetCore.Identity;

namespace Infrastructur.Identity.Seeding
{
    public sealed class IdentitySeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public IdentitySeeder(
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            // =========================
            // Roles
            // =========================

            string[] roles =
            {
                "Customer",
                "Operator",
                "Admin"
            };

            foreach (var roleName in roles)
            {
                if (await _roleManager.RoleExistsAsync(roleName))
                {
                    continue;
                }

                var result = await _roleManager.CreateAsync(
                    new IdentityRole(roleName));

                if (!result.Succeeded)
                {
                    var errors = string.Join(
                        "; ",
                        result.Errors.Select(error => error.Description));

                    throw new InvalidOperationException(
                        $"Failed to create role '{roleName}': {errors}");
                }
            }

            // =========================
            // Test Operator
            // =========================

            var operatorEmail = "operator@seatrack.com";
            var operatorPassword = "SeaTrack123!";

            var operatorUser =
                await _userManager.FindByEmailAsync(operatorEmail);

            if (operatorUser is null)
            {
                operatorUser = new ApplicationUser
                {
                    UserName = operatorEmail,
                    Email = operatorEmail,
                    FullName = "SeaTrack Operator",
                    EmailConfirmed = true
                };

                var createResult = await _userManager.CreateAsync(
                    operatorUser,
                    operatorPassword);

                if (!createResult.Succeeded)
                {
                    var errors = string.Join(
                        "; ",
                        createResult.Errors.Select(
                            error => error.Description));

                    throw new InvalidOperationException(
                        $"Failed to create Operator: {errors}");
                }
            }

            // =========================
            // Assign Operator Role
            // =========================

            if (!await _userManager.IsInRoleAsync(
                    operatorUser,
                    "Operator"))
            {
                var roleResult =
                    await _userManager.AddToRoleAsync(
                        operatorUser,
                        "Operator");

                if (!roleResult.Succeeded)
                {
                    var errors = string.Join(
                        "; ",
                        roleResult.Errors.Select(
                            error => error.Description));

                    throw new InvalidOperationException(
                        $"Failed to assign Operator role: {errors}");
                }
            }
        }
    }
}