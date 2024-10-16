using MediatR;


public class CheckPlagiarismCommand : IRequest<CheckPlagiarismResponse>
{
    public Guid AssignmentId { get; set; }
}

