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

        public async Task<List<object>> CheckForSimilaritiesAsync(Guid id)
    {
        var submissions = await _submissionRepository.GetAllSubmissions(new SubmissionListQuery { AssignmentId = id });
        var ahoCorasick = new AhoCorasick();

        // Build the Aho-Corasick trie with all submissions
        foreach (var submission in submissions.Items!)
        {
            ahoCorasick.AddPattern(submission.SubmittedFile!);
        }
        ahoCorasick.Build();

        List<object> similarSubmissions = [];
        // Compare each submission against all others
        foreach (var submission in submissions.Items)
        {
            int totalMatches = 0;
            foreach (var otherSubmission in submissions.Items)
            {
                if (submission.Id != otherSubmission.Id)
                {
                    var matches = ahoCorasick.Search(otherSubmission.SubmittedFile!);
                    totalMatches += matches.Count;
                }
            }

            // Calculate similarity percentage
            double similarityPercentage = (double)totalMatches / (submissions.TotalCount - 1);
            if (similarityPercentage > 0.6)
            {
                similarSubmissions.Add(submission.StudentId);
            }
        }

        return similarSubmissions;
    }
    }
}