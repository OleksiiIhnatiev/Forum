﻿using MediatR;
using Forum.Application.CQRS.Dtos.Commands;
using Forum.Application.Interfaces.Repositories;

namespace Forum.Application.CQRS.Commands.Auth.Logout;

public class LogoutCommandHandler(IAuthRepository authRepository) : IRequestHandler<LogoutCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var isTokenRemoved = await authRepository.RemoveTokenAsync(request.Token, cancellationToken);

        if (!isTokenRemoved.Succeeded)
        {
            return CreateLoginResult(false, "Logout failed");
        }

        return CreateLoginResult(true);
    }

    private AuthResponseDto CreateLoginResult(bool success, string errorMessage = null, string token = null)
    {
        return new AuthResponseDto { IsSuccess = success, ErrorMessage = errorMessage, Token = token };
    }
}
