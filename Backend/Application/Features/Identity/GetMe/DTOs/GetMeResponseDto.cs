namespace Application.Features.Identity.GetMe.DTOs
{
    public sealed class GetMeResponseDto
    {
        public string UserId { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string[] Roles { get; set; } = Array.Empty<string>();
    }
}