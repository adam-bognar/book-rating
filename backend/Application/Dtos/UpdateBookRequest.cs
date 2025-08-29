using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public record UpdateBookRequest(
        Guid Id,
        string Title,
        string Author,
        DateTime Published,
        string Category
    );
}
