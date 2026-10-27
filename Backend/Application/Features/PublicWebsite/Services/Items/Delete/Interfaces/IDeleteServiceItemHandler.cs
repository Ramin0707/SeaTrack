namespace Application.Features.WebSiteAdmin.Services.Items.Delete.Interfaces;

public interface IDeleteServiceItemHandler
{
    Task<bool> HandleAsync(int id);
}