using Application.Features.Identity.Register.DTOs;
using Application.Features.Identity.Register.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SeaTrack.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public sealed class AuthController : ControllerBase
    {
        private readonly IRegisterHandler _registerHandler;

        public AuthController(IRegisterHandler registerHandler)
        {
            _registerHandler = registerHandler;
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
    }
}