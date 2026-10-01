namespace Application.Features.Identity.Login.DTOs
{
    public sealed class LoginResponseDto
    {
        public bool Succeeded { get; set; }

        public string? AccessToken { get; set; }

        public DateTimeOffset? ExpiresAtUtc { get; set; }

        public string[] Errors { get; set; } = Array.Empty<string>();
    }
}