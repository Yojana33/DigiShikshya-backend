using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigiShikshya.Infrastructure.Algorithms;
using DigiShikshya.Infrastructure.Services;

namespace DigiShikshya.Application.Services.Submission
{
    public class SubmissionService
    {
        private readonly ISubmissionRepository _submissionRepository;
        private readonly EmailService _emailService;

        public SubmissionService(ISubmissionRepository submissionRepository, EmailService emailService)
        {
            _submissionRepository = submissionRepository;
            _emailService = emailService;
        }

        public async Task<bool> CheckForSimilaritiesAsync(string newSubmissionContent, string studentEmail)
        {
            var submissions = await _submissionRepository.GetAllSubmissions(request.SubmittedFile, request.StudentEmail);
            var ahoCorasick = new AhoCorasick();

            foreach (var submission in submissions)
            {
                ahoCorasick.AddPattern(submission.Content);
            }
            ahoCorasick.Build();

            var similarities = ahoCorasick.Search(newSubmissionContent);
            var similarityPercentage = (double)similarities.Count / newSubmissionContent.Length * 100;

            if (similarityPercentage > 60)
            {
                await _emailService.SendEmailAsync(studentEmail, "Plagiarism Alert", "Your submission has exceeded the plagiarism threshold.");
                return true;
            }

            return false;
        }
    }
}