namespace Application.Features.PublicWebsite.Blog.GetPublished.DTOs;

public class GetPublishedBlogPostsResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string? AuthorName { get; set; }

    public DateTime? PublishedAtUtc { get; set; }
}