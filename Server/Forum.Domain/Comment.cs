﻿namespace Forum.Domain;

public class Comment
{
    public Guid Id { get; set; }
    public string Text { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string? HomePage { get; set; }
    public string? FileLink { get; set; }

    public Guid? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }

    public List<Comment> Replies { get; set; } = new();
}
