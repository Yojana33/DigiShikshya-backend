using MediatR;

public class CheckPlagiarismCommandHandler(KeycloakService keyCloakService, SubmissionService submissionService, EmailService emailService) : IRequestHandler<CheckPlagiarismCommand, CheckPlagiarismResponse>
{
    private readonly KeycloakService _keyCloakService = keyCloakService;
    private readonly SubmissionService _submissionService = submissionService;
    private readonly EmailService _emailService = emailService;

    public async Task<CheckPlagiarismResponse> Handle(CheckPlagiarismCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement plagiarism checking logic
        return new CheckPlagiarismResponse { IsPlagiarism = true };
    }
}

