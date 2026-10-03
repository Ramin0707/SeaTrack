using Application.Features.Identity.GetMe.Interfaces;
using Application.Features.Identity.Login.Interfaces;
using Application.Features.Identity.Register.Interfaces;
using Application.Features.Identity.Tokens.Interfaces;
using Application.Features.Shipping.Customer.Cancel.Interfaces;
using Application.Features.Shipping.Customer.Create.Interfaces;
using Application.Features.Shipping.Customer.GetById.Interfaces;
using Application.Features.Shipping.Customer.GetMy.Interfaces;
using Application.Features.Shipping.Customer.Update.Interfaces;
using Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;
using Infrastructur.Data;
using Infrastructur.Features.ShippingOrders.Customer.Cancel;
using Infrastructur.Features.ShippingOrders.Customer.Create;
using Infrastructur.Features.ShippingOrders.Customer.GetById;
using Infrastructur.Features.ShippingOrders.Customer.GetMy;
using Infrastructur.Features.ShippingOrders.Customer.Update;
using Infrastructur.Features.ShippingOrders.LogisticsAdmin.GetAll;
using Infrastructur.Identity;
using Infrastructur.Identity.GetMe;
using Infrastructur.Identity.Login;
using Infrastructur.Identity.Options;
using Infrastructur.Identity.Register;
using Infrastructur.Identity.Seeding;
using Infrastructur.Identity.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste your access token without the Bearer prefix."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database
var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Identity
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;

        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

// JWT settings
var jwtSection = builder.Configuration
    .GetSection(JwtOptions.SectionName);

var jwtOptions = jwtSection.Get<JwtOptions>()
    ?? throw new InvalidOperationException(
        "JWT settings were not found.");

if (string.IsNullOrWhiteSpace(jwtOptions.Issuer)
    || string.IsNullOrWhiteSpace(jwtOptions.Audience)
    || string.IsNullOrWhiteSpace(jwtOptions.SecretKey)
    || jwtOptions.ExpirationMinutes <= 0)
{
    throw new InvalidOperationException(
        "JWT settings are incomplete or invalid.");
}

byte[] keyBytes;

try
{
    keyBytes = Convert.FromBase64String(jwtOptions.SecretKey);
}
catch (FormatException)
{
    throw new InvalidOperationException(
        "JWT SecretKey must be a valid Base64 string.");
}

if (keyBytes.Length < 32)
{
    throw new InvalidOperationException(
        "JWT SecretKey must contain at least 32 random bytes.");
}

builder.Services.Configure<JwtOptions>(jwtSection);

// Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,

            ValidateLifetime = true,
            RequireExpirationTime = true,

            ValidateIssuerSigningKey = true,
            RequireSignedTokens = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 },

            NameClaimType = "sub",
            RoleClaimType = "role",

            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization();

// Handlers and seeding
builder.Services.AddScoped<IRegisterHandler, RegisterHandler>();
builder.Services.AddScoped<IdentitySeeder>();
builder.Services.AddScoped<ILoginHandler, LoginHandler>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IGetMeHandler, GetMeHandler>();
builder.Services.AddScoped<ICreateShippingOrderHandler, CreateShippingOrderHandler>();
builder.Services.AddScoped<IGetMyShippingOrdersHandler, GetMyShippingOrdersHandler>();
builder.Services.AddScoped<IGetShippingOrderByIdHandler, GetShippingOrderByIdHandler>();
builder.Services.AddScoped<IUpdateShippingOrderHandler, UpdateShippingOrderHandler>();
builder.Services.AddScoped<ICancelShippingOrderHandler, CancelShippingOrderHandler>();
builder.Services.AddScoped<IGetAllShippingOrdersHandler, GetAllShippingOrdersHandler>();
builder.Services.AddScoped<IGetShippingOrderByIdHandler,GetShippingOrderByIdHandler>();

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var seeder = scope.ServiceProvider
        .GetRequiredService<IdentitySeeder>();

    await seeder.SeedAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();