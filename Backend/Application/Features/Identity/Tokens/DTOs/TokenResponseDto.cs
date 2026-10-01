namespace Application.Features.Identity.Tokens.DTOs
{
    public sealed class TokenResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;

        public DateTimeOffset ExpiresAtUtc { get; set; }
    }
}