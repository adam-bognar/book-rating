using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappings
{
    public sealed class BookProfile : Profile
    {
        public BookProfile()
        {
            CreateMap<Book, BookDto>()
                .ForMember(x => x.reviews, opt => opt.MapFrom(src => src.Reviews));

            CreateMap<Review, ReviewDto>();

        }
    }
}
