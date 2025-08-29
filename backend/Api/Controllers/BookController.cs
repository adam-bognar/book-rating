using Application.Commands;
using Application.Dtos;
using Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly IMediator _mediator;

        public BookController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{title}")]
        public async Task<ActionResult<BookDto>> GetBookByTitle(string title)
        {
            var query = new GetBookByTitleQuery(title);
            var result = await _mediator.Send(query);

            if(result == null){
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetAll([FromQuery] string? search, [FromQuery] string? category, [FromQuery] string? order)
        {
            var games = await _mediator.Send(new GetAllBooksQuery(search, category, order));
            return Ok(games);
        }

        
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BookDto>> Create([FromBody] CreateBookRequest body)
        {

            var created = await _mediator.Send(new CreateBookCommand(
                body.Title,
                body.Author,
                body.Published,
                body.Category));

            if (created is null)
                return Conflict("A book already exists.");

            return CreatedAtAction(nameof(GetBookByTitle), new { title = created.title }, created);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<BookDto>> Update(Guid id, [FromBody] UpdateBookRequest body)
        {
            if (id != body.Id) return BadRequest("Id doesnt match");

            var updated = await _mediator.Send(new UpdateBookCommand(
                body.Id,
                body.Title,
                body.Author,
                body.Published,
                body.Category
            ));

            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _mediator.Send(new DeleteBookCommand(id));
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
