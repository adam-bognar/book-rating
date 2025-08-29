using System;

namespace Application.Dtos
{
    public sealed record ReviewDto(
        int Rating,
        string Text
    );
}