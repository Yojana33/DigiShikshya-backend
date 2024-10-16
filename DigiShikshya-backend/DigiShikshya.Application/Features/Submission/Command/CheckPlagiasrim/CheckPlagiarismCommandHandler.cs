using MediatR;

public class CheckPlagiarismCommandHandler(KeycloakService keyCloakService, SubmissionService submissionService, EmailService emailService,ISubmissionRepository submissionRepository) : IRequestHandler<CheckPlagiarismCommand, CheckPlagiarismResponse>
{
    private readonly KeycloakService _keyCloakService = keyCloakService;
    private readonly SubmissionService _submissionService = submissionService;
    private readonly EmailService _emailService = emailService;

    public async Task<CheckPlagiarismResponse> Handle(CheckPlagiarismCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement plagiarism checking logic
        var submissions = await submissionRepository.GetAllSubmissions(new SubmissionListQuery{AssignmentId = request.AssignmentId});
        List<Submission> submissionList = submissions.Items.Select(x => new Submission{
            Id = x.Id,
            StudentId = x.StudentId,
        SubmittedFile = Convert.FromBase64String(x.SubmittedFile), // Convert string to byte array
            AssignmentId = x.AssignmentId
        }).ToList();
        var similarSubmissions = await SubmissionService.CheckForSimilaritiesAsync(submissionList);

        if(similarSubmissions.Any())
        {
            
        }
    }
}

/*

{( guid, guid), (guid, guid)}















*/