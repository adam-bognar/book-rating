using Application.Commands;
using Application.Dtos;
using Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class BookLikesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public BookLikesController(IMediator mediator) => _mediator = mediator;

        [HttpPost("books/{bookId:guid}/like")]
        public async Task<IActionResult> Toggle(Guid bookId)
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _mediator.Send(new ToggleBookLikeCommand(bookId, user));
            if (result is null) return NotFound("Book not found");
            return Ok(result);
        }

        [HttpGet("users/me/likes")]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetUserLikes()
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);


            var books = await _mediator.Send(new GetUserLikedBooksQuery(user));
            return Ok(books);
        }
    }
}