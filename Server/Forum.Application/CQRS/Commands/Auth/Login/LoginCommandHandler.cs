using FluentValidation;
using FluentValidation.Results;
using Forum.Application.AppSettings;
using Forum.Application.CQRS.Dtos.Commands;
using Forum.Application.Interfaces.Repositories;
using Forum.Application.Interfaces.Services;
using Forum.Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Forum.Application.CQRS.Commands.Auth.Login;

public class LoginCommandHandler(
    IAuthRepository authRepository,
    UserManager<User> userManager,
    IOptions<AuthenticationOptions> authenticationOptions,
    IJwtService jwtService,
    IValidator<LoginCommand> validator
) : IRequestHandler<LoginCommand, ResponseDto>
{
    public async Task<ResponseDto> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        ValidationResult result = validator.Validate(command);
        if (!result.IsValid)
        {
            foreach (var failure in result.Errors)
            {
                return new ResponseDto(
                    false,
                    $"Property {failure.PropertyName} failed validation. Error: {failure.ErrorMessage}"
                );
            }
        }

        var user = await authRepository.FindByEmailAsync(command.Email, cancellationToken);

        if (user == null)
            return new ResponseDto(false, "User not found");

        var isPasswordValid = await userManager.CheckPasswordAsync(user, command.Password);
        if (!isPasswordValid)
            return new ResponseDto(false, "Invalid password");

        var token = await jwtService.GenerateJwtTokenAsync(user.Id, user.UserName, user.Email);

        var tokenResult = await userManager.SetAuthenticationTokenAsync(
            user,
            authenticationOptions.Value.Forum.Provider,
            authenticationOptions.Value.Forum.TokenName,
            token
        );

        if (!tokenResult.Succeeded)
            return new ResponseDto(false, "Could not save token");

        return new ResponseDto(true, null, token);
    }
}
