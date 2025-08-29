using System;

namespace Application.Dtos
{
    public sealed record ReviewDto(
        Guid Id,
        Guid BookId,
        string UserId,
        int Rating,
        string Text
    );
}