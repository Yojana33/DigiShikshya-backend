using MediatR;

public class CheckPlagiarismCommandHandler(KeycloakService keyCloakService,  EmailService emailService, ISubmissionRepository submissionRepository) : IRequestHandler<CheckPlagiarismCommand, CheckPlagiarismResponse>
{

    public async Task<CheckPlagiarismResponse> Handle(CheckPlagiarismCommand request, CancellationToken cancellationToken)
    {
        // Fetch all submissions for the given assignment
        var submissionList = await submissionRepository.GetAllSubmissions(
            new SubmissionListQuery { AssignmentId = request.AssignmentId });

        // Convert submitted files from Base64 string to byte arrays
        var submissions = submissionList?.Items?.Select(submission => new Submission
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            SubmittedFile = Convert.FromBase64String(submission.SubmittedFile!),
            StudentId = submission.StudentId
        }).ToList();

        // Perform the plagiarism check
        var plagiarismResults = await SubmissionService.CheckForSimilaritiesAsync(submissions!);

        // Extract all unique student IDs involved in plagiarism
        var studentIds = plagiarismResults
            .SelectMany(x => new[] { x.Item1, x.Item2 })
            .Distinct()
            .ToList();

        // Fetch all student details concurrently to avoid multiple sequential requests
        var studentTasks = studentIds.Select(id => keyCloakService.GetUserByIdAsync(id));
        var studentDetails = await Task.WhenAll(studentTasks);

        // Prepare email messages
        var emailTasks = plagiarismResults.Select(async result =>
        {
            var student1 = studentDetails.FirstOrDefault(s => s.Id == result.Item1);
            var student2 = studentDetails.FirstOrDefault(s => s.Id == result.Item2);

            if (student1 != null && student2 != null)
            {
                var message = "You have been accused of plagiarism. Please review the submission.";
                var emailTask1 = emailService.SendEmailAsync(student1.Email, "Plagiarism Alert", message);
                var emailTask2 = emailService.SendEmailAsync(student2.Email, "Plagiarism Alert", message);

                await Task.WhenAll(emailTask1, emailTask2); // Send both emails concurrently
            }
        });

        // Wait for all email sending tasks to complete
        await Task.WhenAll(emailTasks);

        return new CheckPlagiarismResponse
        {
            Message = "Plagiarism check completed",
            IsPlagiarism = plagiarismResults.Any()
        };
    }

}
