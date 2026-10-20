using Application.Features.WebSiteAdmin.Blog.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Blog.Delete;

public class DeleteBlogPostHandler : IDeleteBlogPostHandler
{
    private readonly AppDbContext _dbContext;

    public DeleteBlogPostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var blogPost = await _dbContext.BlogPosts
            .FirstOrDefaultAsync(blogPost => blogPost.Id == id);

        if (blogPost is null)
        {
            return false;
        }

        _dbContext.BlogPosts.Remove(blogPost);

        await _dbContext.SaveChangesAsync();

        return true;
    }
}