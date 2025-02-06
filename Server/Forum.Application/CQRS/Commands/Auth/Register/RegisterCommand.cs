using MediatR;
using Forum.Application.CQRS.Dtos.Commands;

namespace Forum.Application.CQRS.Commands.Auth.Register;

public record RegisterCommand(string UserName, string Email, string Password) : IRequest<AuthResponseDto>;
