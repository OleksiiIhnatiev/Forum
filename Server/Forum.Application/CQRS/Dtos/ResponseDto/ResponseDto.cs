namespace Forum.Application.CQRS.Dtos.Commands;

public record ResponseDto(bool IsSuccess, string ErrorMessage = null, string Token = null);
