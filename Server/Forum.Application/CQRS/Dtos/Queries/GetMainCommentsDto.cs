namespace Forum.Application.CQRS.Dtos.Queries;

public class GetMainCommentsDto
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? HomePage { get; set; }

    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
