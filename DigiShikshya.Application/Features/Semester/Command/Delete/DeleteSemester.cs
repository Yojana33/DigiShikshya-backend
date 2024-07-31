using MediatR;

public class DeleteSemester : IRequest<DeleteSemesterResponse>
{
    public required Guid Id { get; set; }
}
