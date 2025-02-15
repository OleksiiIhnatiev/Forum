using MediatR;
using Forum.Application.CQRS.Dtos.Commands;

namespace Forum.Application.CQRS.Commands.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;
