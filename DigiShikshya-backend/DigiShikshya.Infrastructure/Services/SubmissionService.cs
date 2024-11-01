
public class SubmissionService
{
    private const double SIMILARITY_THRESHOLD = 0.7; // 80% similarity threshold
    

    public static async Task<List<Tuple<Guid, Guid>>> CheckForSimilaritiesAsync(List<Submission> submissions)
    {
        if (submissions == null || submissions.Count < 2)
            return new List<Tuple<Guid, Guid>>();

        var similarSubmissions = new List<Tuple<Guid, Guid>>();
        var ahoCorasick = new AhoCorasick(ignoreCase: true);

        // Validate and preprocess submissions
        var validSubmissions = submissions
            .Where(s => s?.SubmittedFile != null)
            .ToList();

        // Build the Aho-Corasick trie with all submissions
        foreach (var submission in validSubmissions)
        {
            var content = submission.SubmittedFile?.ToString();
            if (!string.IsNullOrWhiteSpace(content))
            {
                ahoCorasick.AddPattern(content);
            }
        }
        ahoCorasick.Build();

        // Compare submissions in parallel for large datasets
        var tasks = new List<Task<List<Tuple<Guid, Guid>>>>();
        
        foreach (var submission in validSubmissions)
        {
            tasks.Add(Task.Run(() => CompareSubmission(submission, validSubmissions, ahoCorasick)));
        }

        var results = await Task.WhenAll(tasks);
        
        // Combine results
        foreach (var result in results)
        {
            similarSubmissions.AddRange(result);
        }

        return similarSubmissions.Distinct().ToList();
    }

    private static List<Tuple<Guid, Guid>> CompareSubmission(
        Submission submission,
        List<Submission> allSubmissions,
        AhoCorasick ahoCorasick)
    {
        var similarities = new List<Tuple<Guid, Guid>>();
        var submissionContent = submission.SubmittedFile!.ToString()!;
        var submissionLength = submissionContent.Length;

        foreach (var otherSubmission in allSubmissions)
        {
            if (submission.Id == otherSubmission.Id)
                continue;

            var otherContent = otherSubmission.SubmittedFile!.ToString()!;
            var matches = ahoCorasick.Search(otherContent);

            // Calculate similarity score
            var matchLength = matches.Sum(m => m.Length);
            var similarityScore = (double)matchLength / Math.Max(submissionLength, otherContent.Length);

            if (similarityScore >= SIMILARITY_THRESHOLD)
            {
                similarities.Add(new Tuple<Guid, Guid>(submission.StudentId, otherSubmission.Id));
            }
        }

        return similarities;
    }
}
