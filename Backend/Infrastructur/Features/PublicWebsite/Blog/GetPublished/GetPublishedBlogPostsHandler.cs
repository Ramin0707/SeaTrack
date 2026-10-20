using Application.Features.PublicWebsite.Blog.GetPublished.DTOs;
using Application.Features.PublicWebsite.Blog.GetPublished.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.PublicWebsite.Blog.GetPublished;

public class GetPublishedBlogPostsHandler : IGetPublishedBlogPostsHandler
{
    private readonly AppDbContext _dbContext;

    public GetPublishedBlogPostsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetPublishedBlogPostsResponseDto>> HandleAsync()
    {
        return await _dbContext.BlogPosts
            .AsNoTracking()
            .Where(blogPost => blogPost.IsPublished)
            .OrderByDescending(blogPost => blogPost.PublishedAtUtc)
            .Select(blogPost => new GetPublishedBlogPostsResponseDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                Slug = blogPost.Slug,
                Summary = blogPost.Summary,
                Content = blogPost.Content,
                ImageUrl = blogPost.ImageUrl,
                AuthorName = blogPost.AuthorName,
                PublishedAtUtc = blogPost.PublishedAtUtc
            })
            .ToListAsync();
    }
}