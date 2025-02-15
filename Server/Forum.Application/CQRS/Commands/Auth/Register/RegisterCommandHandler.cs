﻿using MediatR;
using Microsoft.AspNetCore.Identity;
using Forum.Application.CQRS.Dtos.Commands;
using Forum.Domain;

namespace Forum.Application.CQRS.Commands.Auth.Register;

public class RegisterCommandHandler(UserManager<User> userManager) : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // todo ai move all to FluentValidation
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
        {
            return CreateLoginResult(false, "The email provided is invalid");
        }

        var existingUser = await userManager.FindByEmailAsync(request.Email);

        if (existingUser != null)
        {
            return CreateLoginResult(false, "A user with this email already exists");
        }

        if (string.IsNullOrWhiteSpace(request.UserName))
        {
            return CreateLoginResult(false, "The username cannot be empty");
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
        {
            return CreateLoginResult(false, "The password must be at least 6 characters long");
        }

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email
        };

        var createResult = await userManager.CreateAsync(user, request.Password);

        if (!createResult.Succeeded)
        {
            return CreateLoginResult(false, "User registration failed");
        }

        return CreateLoginResult(true);
    }

    private AuthResponseDto CreateLoginResult(bool success, string errorMessage = null, string token = null)
    {
        return new AuthResponseDto { IsSuccess = success, ErrorMessage = errorMessage, Token = token };
    }
}
