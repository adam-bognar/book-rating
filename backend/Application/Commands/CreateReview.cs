using Application.Common.Interfaces;
using Application.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Commands
{
    public record CreateReviewCommand(Guid BookId, string UserId, int Rating, string Text) : IRequest<ReviewDto?>;

    public class CreateReviewHandler : IRequestHandler<CreateReviewCommand, ReviewDto?>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateReviewHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ReviewDto?> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
        {
            var bookExists = await _context.Books
                .AnyAsync(b => b.Id == request.BookId);

            if (!bookExists) return null;

            var review = new Review
            {
                BookId = request.BookId,
                UserId = request.UserId,
                Rating = request.Rating,
                Text = request.Text
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<ReviewDto>(review);
        }
    }
}