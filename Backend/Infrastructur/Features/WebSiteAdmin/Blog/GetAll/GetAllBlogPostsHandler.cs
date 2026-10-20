using Application.Features.WebSiteAdmin.Blog.GetAll.DTOs;
using Application.Features.WebSiteAdmin.Blog.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Blog.GetAll;

public class GetAllBlogPostsHandler : IGetAllBlogPostsHandler
{
    private readonly AppDbContext _dbContext;

    public GetAllBlogPostsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetAllBlogPostsResponseDto>> HandleAsync()
    {
        return await _dbContext.BlogPosts
            .AsNoTracking()
            .OrderByDescending(blogPost => blogPost.CreatedAtUtc)
            .Select(blogPost => new GetAllBlogPostsResponseDto
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
            })
            .ToListAsync();
    }
}