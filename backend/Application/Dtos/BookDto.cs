using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public record BookDto(Guid id, string title, string author, DateTime published, string category);
}
