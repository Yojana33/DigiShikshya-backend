using MediatR;

public class CheckPlagiarismRequestHandler(KeycloakService _keyCloakService, SubmissionService _submissionService, EmailService _emailService) : IRequestHandler<CheckPlagiarismRequest, CheckPlagiarismResponse>
{
    public async Task<CheckPlagiarismResponse> Handle(CheckPlagiarismRequest request, CancellationToken cancellationToken)
    {
        return new CheckPlagiarismResponse { IsPlagiarism = true };
    }
}

