using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Forum.Application.CQRS.Dtos.Commands;
using Forum.Application.Interfaces.Repositories;
using Forum.Application.Interfaces.Services;
using Forum.Application.Options;
using Forum.Domain.UserAggregate;

namespace Forum.Application.CQRS.Commands.Auth.Login;

public class LoginCommandHandler(
    IAuthRepository authRepository,
    UserManager<User> userManager,
    IOptions<AuthenticationOptions> authenticationOptions,
    IJwtService jwtService) : IRequestHandler<LoginCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await authRepository.FindByEmailAsync(request.Email, cancellationToken);

        if (user == null)
        {
            return CreateLoginResult(false, "User not found");
        }

        var isPasswordValid = await userManager.CheckPasswordAsync(user, request.Password);

        if (!isPasswordValid)
        {
            return CreateLoginResult(false, "Invalid password");
        }

        var token = await jwtService.GenerateJwtTokenAsync(user.UserName);

        var tokenResult = await userManager.SetAuthenticationTokenAsync(user, authenticationOptions.Value.Forum.Provider, authenticationOptions.Value.Forum.TokenName, token);

        if (!tokenResult.Succeeded)
        {
            return CreateLoginResult(false, "Could not save token");
        }

        return CreateLoginResult(true, token: token);
    }

    private AuthResponseDto CreateLoginResult(bool success, string errorMessage = null, string token = null)
    {
        return new AuthResponseDto { IsSuccess = success, ErrorMessage = errorMessage, Token = token };
    }
}
