namespace Application.Features.Logistics.Ports.Delete.Interfaces;

public interface IDeletePortHandler
{
    Task<bool> HandleAsync(int id);
}