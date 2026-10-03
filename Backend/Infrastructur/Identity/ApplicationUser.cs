using Microsoft.AspNetCore.Identity;

namespace Infrastructur.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}