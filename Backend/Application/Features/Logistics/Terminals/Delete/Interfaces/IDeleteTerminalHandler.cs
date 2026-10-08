namespace Application.Features.Logistics.Terminals.Delete.Interfaces;

public interface IDeleteTerminalHandler
{
    Task<bool> HandleAsync(int id);
}