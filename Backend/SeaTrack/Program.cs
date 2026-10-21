using Application.Features.WebSiteAdmin.Media.Interfaces;
using Infrastructur.Data;
using Infrastructur.DependencyInjection;
using Infrastructur.Features.WebSiteAdmin.Home.Seeding;
using Infrastructur.Identity;
using Infrastructur.Identity.Options;
using Infrastructur.Identity.Seeding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SeaTrack.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FullName);

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description =
                "Paste your access token without the Bearer prefix."
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
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


// =========================================================
// Database
// =========================================================

var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));


// =========================================================
// Identity
// =========================================================

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


// =========================================================
// JWT settings
// =========================================================

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
    keyBytes = Convert.FromBase64String(
        jwtOptions.SecretKey);
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

builder.Services.Configure<JwtOptions>(
    jwtSection);


// =========================================================
// Authentication
// =========================================================

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtOptions.Issuer,

                ValidateAudience = true,
                ValidAudience = jwtOptions.Audience,

                ValidateLifetime = true,
                RequireExpirationTime = true,

                ValidateIssuerSigningKey = true,
                RequireSignedTokens = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        keyBytes),

                ValidAlgorithms = new[]
                {
                    SecurityAlgorithms.HmacSha256
                },

                NameClaimType = "sub",
                RoleClaimType = "role",

                ClockSkew =
                    TimeSpan.FromSeconds(30)
            };
    });

builder.Services.AddAuthorization();


// =========================================================
// Application / Infrastructure
// =========================================================

builder.Services.AddApplicationServices();


// =========================================================
// Website Admin - CMS Media
// =========================================================

builder.Services.AddScoped<
    ICmsImageStorageService,
    CmsImageStorageService>();


// =========================================================
// Website Admin - Home Page Seeder
// =========================================================

builder.Services.AddScoped<HomePageSeeder>();


// =========================================================
// CORS
// =========================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();


// =========================================================
// Seed initial application data
// =========================================================

await using (var scope =
    app.Services.CreateAsyncScope())
{
    // Identity roles/users
    var identitySeeder = scope.ServiceProvider
        .GetRequiredService<IdentitySeeder>();

    await identitySeeder.SeedAsync();

    // Default Home Page CMS sections
    var homePageSeeder = scope.ServiceProvider
        .GetRequiredService<HomePageSeeder>();

    await homePageSeeder.SeedAsync();
}


// =========================================================
// Development
// =========================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// =========================================================
// HTTP Pipeline
// =========================================================

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();