using Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.DTOs;
using Application.Features.Shipping.LogisticsAdmin.Customers.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.ShippingOrders.LogisticsAdmin.Customers.GetAll;

public class GetCustomersHandler : IGetCustomersHandler
{
    private readonly AppDbContext _dbContext;

    public GetCustomersHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetCustomerResponseDto>> HandleAsync(
        string? search,
        bool? emailConfirmed)
    {
        var customerRoleId = await _dbContext.Roles
            .Where(x => x.Name == "Customer")
            .Select(x => x.Id)
            .FirstOrDefaultAsync();

        if (customerRoleId is null)
        {
            return new List<GetCustomerResponseDto>();
        }

        var customerIds = _dbContext.UserRoles
            .Where(x => x.RoleId == customerRoleId)
            .Select(x => x.UserId);

        var query = _dbContext.Users
            .AsNoTracking()
            .Where(x => customerIds.Contains(x.Id));

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim();

            query = query.Where(x =>
                x.FullName.Contains(normalizedSearch) ||
                (x.Email != null && x.Email.Contains(normalizedSearch)));
        }

        if (emailConfirmed.HasValue)
        {
            query = query.Where(x =>
                x.EmailConfirmed == emailConfirmed.Value);
        }

        return await query
            .OrderBy(x => x.FullName)
            .Select(x => new GetCustomerResponseDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email ?? string.Empty,
                EmailConfirmed = x.EmailConfirmed,

                ShippingOrdersCount = _dbContext.ShippingOrders
                    .Count(o => o.CustomerId == x.Id)
            })
            .ToListAsync();
    }
}