using Application.Features.WebSiteAdmin.Blog.Create.DTOs;
using Application.Features.WebSiteAdmin.Blog.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Blog.Create;

public class CreateBlogPostHandler : ICreateBlogPostHandler
{
    private readonly AppDbContext _dbContext;

    public CreateBlogPostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateBlogPostResponseDto> HandleAsync(
        CreateBlogPostRequestDto request)
    {
        var slug = request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _dbContext.BlogPosts
            .AnyAsync(blogPost => blogPost.Slug == slug);

        if (slugExists)
        {
            throw new InvalidOperationException(
                "A blog post with this slug already exists.");
        }

        var now = DateTime.UtcNow;

        var blogPost = new BlogPost
        {
            Title = request.Title.Trim(),
            Slug = slug,
            Summary = request.Summary.Trim(),
            Content = request.Content.Trim(),
            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim(),
            AuthorName = string.IsNullOrWhiteSpace(request.AuthorName)
                ? null
                : request.AuthorName.Trim(),
            IsPublished = request.IsPublished,
            CreatedAtUtc = now,
            PublishedAtUtc = request.IsPublished ? now : null
        };

        _dbContext.BlogPosts.Add(blogPost);

        await _dbContext.SaveChangesAsync();

        return new CreateBlogPostResponseDto
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
            PublishedAtUtc = blogPost.PublishedAtUtc
        };
    }
}