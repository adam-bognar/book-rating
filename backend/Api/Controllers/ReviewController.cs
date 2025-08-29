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
    [Route("api/books/{bookId:guid}/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ReviewController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews(Guid bookId)
        {
            var reviews = await _mediator.Send(new GetReviewsForBookQuery(bookId));
            return Ok(reviews);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> Create(Guid bookId, [FromBody] CreateReviewRequest body)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _mediator.Send(new CreateReviewCommand(bookId,userId, body.Rating, body.Text));
            if (result is null) return NotFound("Book not found");
            return CreatedAtAction(nameof(GetReviews), new { bookId }, result);
        }


    }
}