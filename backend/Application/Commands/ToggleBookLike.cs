using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Commands
{
    public record ToggleBookLikeCommand(Guid BookId, string UserId) : IRequest<bool?>;

    public class ToggleBookLikeHandler : IRequestHandler<ToggleBookLikeCommand, bool?>
    {
        private readonly IApplicationDbContext _context;

        public ToggleBookLikeHandler(IApplicationDbContext context) => _context = context;

        public async Task<bool?> Handle(ToggleBookLikeCommand request, CancellationToken cancellationToken)
        {
            var existing = await _context.BookLikes
                .FirstOrDefaultAsync(x => x.BookId == request.BookId && x.UserId == request.UserId);

            if (existing is not null)
            {
                _context.BookLikes.Remove(existing);
                await _context.SaveChangesAsync();
                return false;
            }

            var bookExists = await _context.Books
                .AnyAsync(b => b.Id == request.BookId);

            if (!bookExists)
                return null; 

            _context.BookLikes.Add(new BookLike { BookId = request.BookId, UserId = request.UserId });
            await _context.SaveChangesAsync();
            return true; 
        }
    }
}