using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Book> Books { get; }
        DbSet<Review> Reviews { get; }
        DbSet<BookLike> BookLikes { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}