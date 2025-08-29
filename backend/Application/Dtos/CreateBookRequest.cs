using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public record CreateBookRequest(string Title, string Author, DateTime Published, string Category);
}
