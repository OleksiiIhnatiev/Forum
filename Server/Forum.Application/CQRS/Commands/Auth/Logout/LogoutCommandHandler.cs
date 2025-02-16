using FluentValidation;
using FluentValidation.Results;
using Forum.Application.CQRS.Dtos.Commands;
using Forum.Application.Interfaces.Repositories;
using MediatR;

namespace Forum.Application.CQRS.Commands.Auth.Logout;

public class LogoutCommandHandler(
    IAuthRepository authRepository,
    IValidator<LogoutCommand> validator
) : IRequestHandler<LogoutCommand, ResponseDto>
{
    public async Task<ResponseDto> Handle(
        LogoutCommand command,
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

        var isTokenRemoved = await authRepository.RemoveTokenAsync(
            command.Token,
            cancellationToken
        );

        if (!isTokenRemoved.Succeeded)
        {
            return new ResponseDto(false, "Logout failed");
        }

        return new ResponseDto(true);
    }
}
