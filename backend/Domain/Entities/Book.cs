using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Book
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public DateTime Published { get; set; }
        public string Category { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<BookLike> BookLikes { get; set; }

        public Book() { }

        public Book(string title, string author, DateTime published, string category)
        {
            Id = Guid.NewGuid();
            Title = title;
            Author = author;
            Published = published;
            Category = category;
            Reviews = new List<Review>();
            BookLikes = new List<BookLike>();
        }
    }
}
