using FluentValidation;
using Forum.Application.CQRS.Commands.Auth.Register;

namespace Forum.Application.Validation;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(command => command.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Email must be valid.");

        RuleFor(command => command.UserName).NotEmpty().WithMessage("Username is required.");

        RuleFor(command => command.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long.");
    }
}
