namespace Application.Features.WebSiteAdmin.Blog.Update.DTOs;

public class UpdateBlogPostRequestDto
{
    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string? AuthorName { get; set; }

    public bool IsPublished { get; set; }
}