using Application.Common.Interfaces;
using Application.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace Application.Commands
{
    public record CreateBookCommand(string Title, string Author, DateTime Published, string Category) : IRequest<BookDto?>;

    public class CreateBookHandler : IRequestHandler<CreateBookCommand, BookDto?>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateBookHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BookDto?> Handle(CreateBookCommand request, CancellationToken cancellationToken)
        {
            var exists = await _context.Books
                .AnyAsync(b => b.Title.ToLower() == request.Title.ToLower());

            if (exists) return null;

            var book = new Book
            {
                Title = request.Title,
                Author = request.Author,
                Published = request.Published,
                Category = request.Category
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BookDto>(book);
        }
    }
}