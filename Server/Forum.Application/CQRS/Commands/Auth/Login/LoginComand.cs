using Forum.Application.CQRS.Dtos.Commands;
using MediatR;

namespace Forum.Application.CQRS.Commands.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<ResponseDto>;
