using Microsoft.AspNetCore.Identity;

namespace Infrastructur.Identity.Seeding
{
    public sealed class IdentitySeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public IdentitySeeder(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            string[] roles = { "Customer", "Operator", "Admin" };

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
        }
    }
}