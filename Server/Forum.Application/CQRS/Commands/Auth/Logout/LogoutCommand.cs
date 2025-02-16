using Forum.Application.CQRS.Dtos.Commands;
using MediatR;

namespace Forum.Application.CQRS.Commands.Auth.Logout;

public record LogoutCommand(string Token) : IRequest<ResponseDto>;
