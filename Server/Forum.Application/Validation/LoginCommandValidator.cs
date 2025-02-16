using FluentValidation;
using Forum.Application.CQRS.Commands.Auth.Login;

namespace Forum.Application.Validation;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(command => command.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Email must be valid.");

        RuleFor(command => command.Password).NotEmpty().WithMessage("Password is required.");
    }
}
