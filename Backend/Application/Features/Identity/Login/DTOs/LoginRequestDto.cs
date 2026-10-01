using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Login.DTOs
{
    public sealed class LoginRequestDto
    {
        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(128)]
        public string Password { get; set; } = string.Empty;
    }
}