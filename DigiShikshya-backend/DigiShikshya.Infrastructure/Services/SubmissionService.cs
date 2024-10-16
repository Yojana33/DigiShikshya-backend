    using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigiShikshya.Infrastructure.Algorithms;
using DigiShikshya.Infrastructure.Services;


    public class SubmissionService
    {

    public static Task<List<Tuple<Guid, Guid>>> CheckForSimilaritiesAsync(List<Submission> submissions)
    {
        var ahoCorasick = new AhoCorasick();

        // Build the Aho-Corasick trie with all submissions
        foreach (var submission in submissions)
        {
            ahoCorasick.AddPattern(submission.SubmittedFile!.ToString()!);
        }
        ahoCorasick.Build();

        List<Tuple<Guid, Guid>> similarSubmissions = [];
        // Compare each submission against all others
        foreach (var submission in submissions)
        {
            int totalMatches = 0;
            foreach (var otherSubmission in submissions)
            {
                if (submission.Id != otherSubmission.Id)
                {
                    var matches =  ahoCorasick.Search(otherSubmission.SubmittedFile!.ToString()!);
                    totalMatches += matches.Count;
                }
            }
            similarSubmissions.Add(new Tuple<Guid, Guid>(submission.StudentId, otherSubmission.Id));
        }

        return similarSubmissions;
    }
}
