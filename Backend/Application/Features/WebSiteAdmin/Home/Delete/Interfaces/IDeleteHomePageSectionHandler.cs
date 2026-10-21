namespace Application.Features.WebSiteAdmin.Home.Delete.Interfaces;

public interface IDeleteHomePageSectionHandler
{
    Task<bool> HandleAsync(int id);
}