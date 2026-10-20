namespace Application.Features.WebSiteAdmin.Blog.Create.DTOs;

public class CreateBlogPostRequestDto
{
    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string? AuthorName { get; set; }

    public bool IsPublished { get; set; }
}