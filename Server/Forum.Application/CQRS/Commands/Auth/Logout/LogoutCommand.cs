using MediatR;
using Forum.Application.CQRS.Dtos.Commands;

namespace Forum.Application.CQRS.Commands.Auth.Logout;

public record LogoutCommand(string Token) : IRequest<AuthResponseDto>;
