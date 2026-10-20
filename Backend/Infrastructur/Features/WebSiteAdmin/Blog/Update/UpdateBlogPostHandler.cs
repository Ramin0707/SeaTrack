using Application.Features.WebSiteAdmin.Blog.Update.DTOs;
using Application.Features.WebSiteAdmin.Blog.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Blog.Update;

public class UpdateBlogPostHandler : IUpdateBlogPostHandler
{
    private readonly AppDbContext _dbContext;

    public UpdateBlogPostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateBlogPostResponseDto?> HandleAsync(
        int id,
        UpdateBlogPostRequestDto request)
    {
        var blogPost = await _dbContext.BlogPosts
            .FirstOrDefaultAsync(blogPost => blogPost.Id == id);

        if (blogPost is null)
        {
            return null;
        }

        var slug = request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _dbContext.BlogPosts
            .AnyAsync(blogPost =>
                blogPost.Id != id &&
                blogPost.Slug == slug);

        if (slugExists)
        {
            throw new InvalidOperationException(
                "A blog post with this slug already exists.");
        }

        var now = DateTime.UtcNow;

        blogPost.Title = request.Title.Trim();
        blogPost.Slug = slug;
        blogPost.Summary = request.Summary.Trim();
        blogPost.Content = request.Content.Trim();

        blogPost.ImageUrl =
            string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim();

        blogPost.AuthorName =
            string.IsNullOrWhiteSpace(request.AuthorName)
                ? null
                : request.AuthorName.Trim();

        if (request.IsPublished && !blogPost.IsPublished)
        {
            blogPost.PublishedAtUtc = now;
        }
        else if (!request.IsPublished)
        {
            blogPost.PublishedAtUtc = null;
        }

        blogPost.IsPublished = request.IsPublished;
        blogPost.UpdatedAtUtc = now;

        await _dbContext.SaveChangesAsync();

        return new UpdateBlogPostResponseDto
        {
            Id = blogPost.Id,
            Title = blogPost.Title,
            Slug = blogPost.Slug,
            Summary = blogPost.Summary,
            Content = blogPost.Content,
            ImageUrl = blogPost.ImageUrl,
            AuthorName = blogPost.AuthorName,
            IsPublished = blogPost.IsPublished,
            CreatedAtUtc = blogPost.CreatedAtUtc,
            UpdatedAtUtc = blogPost.UpdatedAtUtc,
            PublishedAtUtc = blogPost.PublishedAtUtc
        };
    }
}