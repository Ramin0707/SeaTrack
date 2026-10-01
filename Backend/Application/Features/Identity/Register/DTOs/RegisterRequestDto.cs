using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Register.DTOs
{
    public sealed class RegisterRequestDto
    {
        [Required]
        [StringLength(200)]
        [RegularExpression(@".*\S.*",
            ErrorMessage = "Full name cannot be empty.")]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(128, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;
    }
}