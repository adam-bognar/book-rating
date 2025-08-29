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
    public sealed record GetUserLikedBooksQuery(string UserId) : IRequest<List<BookDto>>;

    public sealed class GetUserLikedBooksHandler : IRequestHandler<GetUserLikedBooksQuery, List<BookDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetUserLikedBooksHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BookDto>> Handle(GetUserLikedBooksQuery request, CancellationToken cancellationToken)
        {
            return await _context.BookLikes
                .Where(bl => bl.UserId == request.UserId)
                .Select(bl => bl.Book)
                .ProjectTo<BookDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}