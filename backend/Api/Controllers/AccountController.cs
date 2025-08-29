using Application.Commands;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(IMediator mediator, UserManager<ApplicationUser> userManager)
        {
            _mediator = mediator;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register([FromBody] RegisterUserCommand command)
        {
            var userId = await _mediator.Send(command);
            return Ok(userId);
        }

        [HttpPost("login")]
        public async Task<ActionResult<bool>> Login([FromBody] LoginUserCommand command)
        {
            var success = await _mediator.Send(command);
            if (success) return Ok();
            return Unauthorized();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Ok();
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserMeResponse>> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new UserMeResponse(
                user.Email ?? string.Empty,
                roles.ToList()
            ));
        }

        public sealed record UserMeResponse(string Email, List<string> Roles);
    }
}
