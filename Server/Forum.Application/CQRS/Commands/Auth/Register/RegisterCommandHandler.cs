using FluentValidation;
using FluentValidation.Results;
using Forum.Application.CQRS.Dtos.Commands;
using Forum.Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Forum.Application.CQRS.Commands.Auth.Register;

public class RegisterCommandHandler(
    UserManager<User> userManager,
    IValidator<RegisterCommand> validator
) : IRequestHandler<RegisterCommand, ResponseDto>
{
    public async Task<ResponseDto> Handle(
        RegisterCommand command,
        CancellationToken cancellationToken
    )
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

        var existingUser = await userManager.FindByEmailAsync(command.Email);

        if (existingUser != null)
        {
            return new ResponseDto(false, "A user with this email already exists");
        }

        var user = new User { UserName = command.UserName, Email = command.Email };

        var createResult = await userManager.CreateAsync(user, command.Password);

        if (!createResult.Succeeded)
        {
            return new ResponseDto(false, "User registration failed");
        }

        return new ResponseDto(true);
    }
}
