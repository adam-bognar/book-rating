using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Review
    {
        public Guid Id { get; set; }
        public int Rating { get; set; }
        public string Text { get; set; }

        public Guid BookId { get; set; }
        public Book Book { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public Review() { }

        public Review(int rating, string text, Guid bookId, string userId) {
            Id = Guid.NewGuid();
            Rating = rating;
            Text = text;
            BookId = bookId;
            UserId = userId;
        }


    }
}
