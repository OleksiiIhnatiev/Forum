namespace Forum.Domain;

public class Comment
{
    public Guid Id { get; set; }
    public string Text { get; set; }

    // note ai I would return '= DateTime.UtcNow;' implementation as it takes less code writing and looks less voluminous. Look what has appeared in ForumContext
    public DateTime CreatedAt { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string? HomePage { get; set; }
    public string? FileLink { get; set; }

    public Guid? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }

    public List<Comment> Replies { get; set; } = new();
}
