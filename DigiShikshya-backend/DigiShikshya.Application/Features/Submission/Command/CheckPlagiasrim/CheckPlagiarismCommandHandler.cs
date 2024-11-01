using MediatR;

public class CheckPlagiarismCommandHandler : IRequestHandler<CheckPlagiarismCommand, CheckPlagiarismResponse>
{
    private readonly KeycloakService _keycloakService;
    private readonly EmailService _emailService;
    private readonly ISubmissionRepository _submissionRepository;

    public CheckPlagiarismCommandHandler(
        KeycloakService keycloakService,
        EmailService emailService,
        ISubmissionRepository submissionRepository)
    {
        _keycloakService = keycloakService;
        _emailService = emailService;
        _submissionRepository = submissionRepository;
    }

    public async Task<CheckPlagiarismResponse> Handle(CheckPlagiarismCommand request, CancellationToken cancellationToken)
    {
        var submissions = await GetSubmissionsAsync(request.AssignmentId);
        if (submissions.Count == 0)
        {
            return new CheckPlagiarismResponse { Message = "No submissions found", IsPlagiarism = false };
        }

        var plagiarismResults = await SubmissionService.CheckForSimilaritiesAsync(submissions);
        if (!plagiarismResults.Any())
        {
            return new CheckPlagiarismResponse { Message = "No plagiarism detected", IsPlagiarism = false };
        }

        await NotifyStudentsAsync(plagiarismResults);

        return new CheckPlagiarismResponse
        {
            Message = "Plagiarism detected and notifications sent",
            IsPlagiarism = true
        };
    }

    private async Task<List<Submission>> GetSubmissionsAsync(Guid assignmentId)
    {
        var submissionList = await _submissionRepository.GetAllSubmissions(
            new SubmissionListQuery { AssignmentId = assignmentId });

        return submissionList?.Items?
            .Select(s => new Submission
            {
                Id = s.Id,
                AssignmentId = s.AssignmentId,
                SubmittedFile = Convert.FromBase64String(s.SubmittedFile ?? string.Empty),
                StudentId = s.StudentId
            })
            .ToList() ?? new List<Submission>();
    }

    private async Task NotifyStudentsAsync(IEnumerable<Tuple<Guid, Guid>> plagiarismResults)
    {
        var studentIds = plagiarismResults
            .SelectMany(x => new[] { x.Item1, x.Item2 })
            .Distinct();

        var studentDetails = await GetStudentDetailsAsync(studentIds);
        await SendPlagiarismNotificationsAsync(plagiarismResults, studentDetails);
    }

    private async Task<Dictionary<Guid, User>> GetStudentDetailsAsync(IEnumerable<Guid> studentIds)
    {
        var tasks = studentIds.Select(id => _keycloakService.GetUserByIdAsync(id));
        var results = await Task.WhenAll(tasks);
        return results.ToDictionary(user => user.Id);
    }

    private async Task SendPlagiarismNotificationsAsync(
        IEnumerable<Tuple<Guid, Guid>> plagiarismResults,
        Dictionary<Guid, User> studentDetails)
    {
        const string subject = "Plagiarism Alert";
        const string message = "You have been accused of plagiarism. Please review the submission.";

        var emailTasks = plagiarismResults
            .SelectMany(result => new[]
            {
                SendEmailIfUserExists(studentDetails, result.Item1, subject, message),
                SendEmailIfUserExists(studentDetails, result.Item2, subject, message)
            });

        await Task.WhenAll(emailTasks);
    }

    private async Task SendEmailIfUserExists(
        Dictionary<Guid, User> studentDetails,
        Guid studentId,
        string subject,
        string message)
    {
        if (studentDetails.TryGetValue(studentId, out var student))
        {
            await _emailService.SendEmailAsync(student.Email, subject, message);
        }
    }
}
