using Application.Features.Identity.Tokens.DTOs;
using Application.Features.Identity.Tokens.Interfaces;
using Infrastructur.Identity.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructur.Identity.Services
{
    public sealed class JwtTokenService : IJwtTokenService
    {
        private readonly JwtOptions _jwtOptions;

        public JwtTokenService(IOptions<JwtOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
        }

        public TokenResponseDto CreateToken(
            string userId,
            IEnumerable<string> roles)
        {
            var now = DateTimeOffset.UtcNow;
            var expiresAt = now.AddMinutes(
                _jwtOptions.ExpirationMinutes);

            var keyBytes = Convert.FromBase64String(
                _jwtOptions.SecretKey);

            var signingKey = new SymmetricSecurityKey(keyBytes);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _jwtOptions.Issuer,
                Audience = _jwtOptions.Audience,

                IssuedAt = now.UtcDateTime,
                NotBefore = now.UtcDateTime,
                Expires = expiresAt.UtcDateTime,

                Claims = new Dictionary<string, object>
                {
                    ["sub"] = userId,
                    ["jti"] = Guid.NewGuid().ToString(),
                    ["role"] = roles.ToArray()
                },

                SigningCredentials = new SigningCredentials(
                    signingKey,
                    SecurityAlgorithms.HmacSha256)
            };

            var tokenHandler = new JsonWebTokenHandler();

            return new TokenResponseDto
            {
                AccessToken = tokenHandler.CreateToken(tokenDescriptor),
                ExpiresAtUtc = expiresAt
            };
        }
    }
}