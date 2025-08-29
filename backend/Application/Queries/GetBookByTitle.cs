using Application.Common.Interfaces;
using Application.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries
{
    public record GetBookByTitleQuery(string title) : IRequest<BookDto?>;

    public class GetBookByTitleHandler : IRequestHandler<GetBookByTitleQuery, BookDto?>
    {

        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBookByTitleHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BookDto?> Handle(GetBookByTitleQuery request, CancellationToken cancellationToken)
        {
            var book = await _context.Books.FirstOrDefaultAsync(x => x.Title.ToLower() == request.title.ToLower());

            return book is null ? null : _mapper.Map<BookDto?>(book);
        }
    }
}
