namespace Forum.Application.CQRS.Queries.Comments.GetMainComments;

public class GetMainCommentsQueryDto
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? HomePage { get; set; }

    public string UserName { get; set; }
    public string Email { get; set; }
}
