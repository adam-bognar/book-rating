using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Commands
{
    public record DeleteBookCommand(Guid Id) : IRequest<bool>;

    public class DeleteBookHandler : IRequestHandler<DeleteBookCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public DeleteBookHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteBookCommand request, CancellationToken cancellationToken)
        {
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (book is null) return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}