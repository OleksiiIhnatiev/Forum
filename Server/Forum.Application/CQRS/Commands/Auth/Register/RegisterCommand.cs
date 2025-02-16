using Forum.Application.CQRS.Dtos.Commands;
using MediatR;

namespace Forum.Application.CQRS.Commands.Auth.Register;

public record RegisterCommand(string UserName, string Email, string Password)
    : IRequest<ResponseDto>;
