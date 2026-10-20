namespace Application.Features.WebSiteAdmin.Blog.GetAll.DTOs;

public class GetAllBlogPostsResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string? AuthorName { get; set; }

    public bool IsPublished { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }

    public DateTime? PublishedAtUtc { get; set; }
}