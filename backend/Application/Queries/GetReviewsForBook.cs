using Application.Common.Interfaces;
using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Queries
{
    public sealed record GetReviewsForBookQuery(Guid BookId) : IRequest<List<ReviewDto>>;

    public sealed class GetReviewsForBookHandler : IRequestHandler<GetReviewsForBookQuery, List<ReviewDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetReviewsForBookHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ReviewDto>> Handle(GetReviewsForBookQuery request, CancellationToken cancellationToken)
        {
            return await _context.Reviews
                .Where(r => r.BookId == request.BookId)
                .ProjectTo<ReviewDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}