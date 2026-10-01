namespace Application.Features.Identity.Register.DTOs
{
    public sealed class RegisterResponseDto
    {
        public bool Succeeded { get; set; }

        public string? UserId { get; set; }

        public string[] Errors { get; set; } = Array.Empty<string>();
    }
}