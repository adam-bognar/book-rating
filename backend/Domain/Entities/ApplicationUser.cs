using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Review> Reviews { get; set; }
        public ICollection<BookLike> BookLikes { get; set; }


        public ApplicationUser()
        {
            Reviews = new List<Review>();
            BookLikes = new List<BookLike>();
        }
    }
}
