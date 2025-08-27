using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands
{
    public record RegisterUserCommand(string username, string email, string password) : IRequest<string>;

    public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, string>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public RegisterUserHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var user = new ApplicationUser
            {
                UserName = request.username,
                Email = request.email,
            };

            var result = await _userManager.CreateAsync(user, request.password);

            if (result.Succeeded) return "User created";
            
            throw new Exception("Registration failed: " + string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }

}
