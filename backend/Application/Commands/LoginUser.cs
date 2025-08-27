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
    public record LoginUserCommand(string username, string password, bool rememberMe) : IRequest<bool>;

    public class LoginUserHandler : IRequestHandler<LoginUserCommand, bool>
    {
        private readonly SignInManager<ApplicationUser> _signInManager;

        public LoginUserHandler(SignInManager<ApplicationUser> signInManager)
        {
            _signInManager = signInManager;
        }

        public async Task<bool> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var result = await _signInManager.PasswordSignInAsync(request.username, request.password, request.rememberMe, lockoutOnFailure:false);
            return result.Succeeded;
        }
    }

}
