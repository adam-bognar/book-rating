using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Book> Books => Set<Book>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<BookLike> BookLikes => Set<BookLike>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            

            builder.Entity<Review>(r =>
            {
                r.HasKey(x => x.Id);

                r.HasOne(x => x.Book)
                    .WithMany(b => b.Reviews)
                    .HasForeignKey(x => x.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                r.HasOne(x => x.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<BookLike>(l =>
            {
                l.HasKey(x => new { x.BookId, x.UserId });

                l.HasOne(x => x.Book)
                    .WithMany(b => b.BookLikes)
                    .HasForeignKey(x => x.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                l.HasOne(x => x.User)
                    .WithMany(u => u.BookLikes)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                l.HasIndex(x => x.UserId);
                l.HasIndex(x => x.BookId);
            });
        }
    }
}
