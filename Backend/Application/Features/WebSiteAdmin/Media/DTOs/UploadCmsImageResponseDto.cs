namespace Application.Features.WebSiteAdmin.Media.DTOs;

public class UploadCmsImageResponseDto
{
    public string FileName { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long Size { get; set; }
}