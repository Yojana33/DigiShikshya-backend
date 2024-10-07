using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigiShikshya.Infrastructure.Algorithms;
using DigiShikshya.Infrastructure.Services;


public class SubmissionService
{
    private readonly ISubmissionRepository _submissionRepository;
    //private readonly EmailService _emailService;

    public SubmissionService(ISubmissionRepository submissionRepository)
    {
        _submissionRepository = submissionRepository;
        //_emailService = emailService;
    }

    public async Task<List<object>> CheckForSimilaritiesAsync(Guid id)
    {
        var submissions = await _submissionRepository.GetAllSubmissions(new SubmissionListQuery { AssignmentId = id });
        var ahoCorasick = new AhoCorasick();

        // Build the Aho-Corasick trie with all submissions
        // foreach (var submission in submissions.Items!)
        // {
        //     ahoCorasick.AddPattern(submission.SubmittedFile!);
        // }
        // ahoCorasick.Build();

        foreach (var submission in submissions.Items!)
        {
            var sentences = SplitIntoSentences(submission.SubmittedFile!); // Split the submission into sentences or chunks
            foreach (var sentence in sentences)
            {
                ahoCorasick.AddPattern(sentence);  // Add each sentence or chunk as a pattern
            }
        }
        ahoCorasick.Build();  // Build the trie after all patterns are added


        List<object> similarSubmissions = [];
        // Compare each submission against all others
        foreach (var submission in submissions.Items)
        {
            double totalMatches = 0;
            foreach (var otherSubmission in submissions.Items)
            {
                if (submission.Id != otherSubmission.Id)
                {
                    var matches = ahoCorasick.Search(otherSubmission.SubmittedFile!);
                    double matchRatio = (double)matches.Count / Math.Max(submission.SubmittedFile!.Length, otherSubmission.SubmittedFile!.Length);
                    //totalMatches += matches.Count;
                    totalMatches += matchRatio;

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
    private List<string> SplitIntoSentences(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return new List<string>();
        }

        // A basic example of splitting by punctuation marks
        char[] delimiters = new char[] { '.', '!', '?' };
        var sentences = text.Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                            .Select(sentence => sentence.Trim())
                            .ToList();

        return sentences;
    }

}
}
