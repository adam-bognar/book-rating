using Application.Common.Interfaces;
using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries
{
    public record GetAllBooksQuery(string? search, string? category, string? order) : IRequest<List<BookDto>>;

    public class GetAllBooksHandler : IRequestHandler<GetAllBooksQuery, List<BookDto>>
    {

        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetAllBooksHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BookDto>> Handle(GetAllBooksQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.search))
            {
                query = query.Where(x=> x.Title.Contains(request.search) || x.Author.Contains(request.search));
            }

            if (!string.IsNullOrWhiteSpace(request.category))
            {
                query = query.Where(x => x.Category.ToLower() == request.category.ToLower());
            }

            query = !string.IsNullOrWhiteSpace(request.order) ? query.OrderByDescending(x=> x.Title) : query.OrderBy(x=> x.Title);

            var books = await query.ProjectTo<BookDto>(_mapper.ConfigurationProvider).ToListAsync();

            return books;
        }
    }
}
