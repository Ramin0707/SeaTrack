namespace Application.Features.Logistics.PortCalls.Delete.Interfaces;

public interface IDeletePortCallHandler
{
    Task<bool> HandleAsync(int id);
}