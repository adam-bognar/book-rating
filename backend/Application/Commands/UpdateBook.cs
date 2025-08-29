using Application.Common.Interfaces;
using Application.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Commands
{
    public record UpdateBookCommand(
        Guid Id,
        string Title,
        string Author,
        DateTime Published,
        string Category
    ) : IRequest<BookDto?>;

    public class UpdateBookHandler : IRequestHandler<UpdateBookCommand, BookDto?>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateBookHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BookDto?> Handle(UpdateBookCommand request, CancellationToken cancellationToken)
        {
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.Id == request.Id);

            if (book is null) return null;

            book.Title = request.Title;
            book.Author = request.Author;
            book.Published = request.Published;
            book.Category = request.Category;

            await _context.SaveChangesAsync();

            return _mapper.Map<BookDto>(book);
        }
    }
}