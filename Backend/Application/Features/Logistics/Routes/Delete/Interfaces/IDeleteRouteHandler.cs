namespace Application.Features.Logistics.Routes.Delete.Interfaces;

public interface IDeleteRouteHandler
{
    Task<bool> HandleAsync(int id);
}