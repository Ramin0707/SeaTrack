using Application.Features.Identity.GetMe.DTOs;
using Application.Features.Identity.GetMe.Interfaces;
using Application.Features.Identity.Login.DTOs;
using Application.Features.Identity.Login.Interfaces;
using Application.Features.Identity.Register.DTOs;
using Application.Features.Identity.Register.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers.Auth
{
    [ApiController]
    [Route("api/auth")]
    public sealed class AuthController : ControllerBase
    {
        private readonly IRegisterHandler _registerHandler;
        private readonly ILoginHandler _loginHandler;
        private readonly IGetMeHandler _getMeHandler;

        public AuthController(
            IRegisterHandler registerHandler,
            ILoginHandler loginHandler,
            IGetMeHandler getMeHandler)
        {
            _registerHandler = registerHandler;
            _loginHandler = loginHandler;
            _getMeHandler = getMeHandler;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponseDto>> Register(
            [FromBody] RegisterRequestDto request)
        {
            var result = await _registerHandler.HandleAsync(request);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return StatusCode(StatusCodes.Status201Created, result);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(
            [FromBody] LoginRequestDto request)
        {
            var result = await _loginHandler.HandleAsync(request);

            if (!result.Succeeded)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<GetMeResponseDto>> GetMe()
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            var result = await _getMeHandler.HandleAsync(userId);

            if (result is null)
            {
                return Unauthorized();
            }

            return Ok(result);
        }
    }
}