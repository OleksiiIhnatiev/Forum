using FluentValidation;
using Forum.Application.CQRS.Commands.Auth.Logout;

namespace Forum.Application.Validation;

public class LogoutCommandValidator : AbstractValidator<LogoutCommand>
{
    public LogoutCommandValidator()
    {
        RuleFor(command => command.Token).NotEmpty().WithMessage("Token is required.");
    }
}
