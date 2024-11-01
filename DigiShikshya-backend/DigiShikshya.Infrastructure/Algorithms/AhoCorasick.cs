
    public class AhoCorasick
    {
        private readonly Node _root;
        private readonly bool _ignoreCase;
        private readonly Dictionary<string, List<string>> _cache;

        public AhoCorasick(bool ignoreCase = false)
        {
            _root = new Node();
            _ignoreCase = ignoreCase;
            _cache = new Dictionary<string, List<string>>();
        }

        private sealed class Node
        {
            public readonly Dictionary<char, Node> Children = new(4); // Initial capacity optimization
            public Node? Failure;
            public readonly HashSet<string> Outputs = new();
        }

        public void AddPattern(string pattern)
        {
            if (string.IsNullOrEmpty(pattern))
                throw new ArgumentException("Pattern cannot be null or empty", nameof(pattern));

            var processedPattern = _ignoreCase ? pattern.ToLowerInvariant() : pattern;
            var node = _root;

            foreach (var ch in processedPattern)
            {
                if (!node.Children.TryGetValue(ch, out var nextNode))
                {
                    nextNode = new Node();
                    node.Children[ch] = nextNode;
                }
                node = nextNode;
            }
            node.Outputs.Add(pattern);
        }

        public void Build()
        {
            var queue = new Queue<Node>();
            
            foreach (var (_, child) in _root.Children)
            {
                child.Failure = _root;
                queue.Enqueue(child);
            }

            while (queue.TryDequeue(out var currentNode))
            {
                foreach (var (ch, childNode) in currentNode.Children)
                {
                    var failureNode = currentNode.Failure;
                    
                    while (failureNode != null && !failureNode.Children.ContainsKey(ch))
                        failureNode = failureNode.Failure;
                    
                    childNode.Failure = failureNode?.Children.GetValueOrDefault(ch) ?? _root;
                    foreach (var output in childNode.Failure.Outputs)
                        childNode.Outputs.Add(output);
                    
                    queue.Enqueue(childNode);
                }
            }
        }

        public List<string> Search(string text)
        {
            if (string.IsNullOrEmpty(text))
                return new List<string>();

            if (_cache.TryGetValue(text, out var cachedResult))
                return new List<string>(cachedResult);

            var processedText = _ignoreCase ? text.ToLowerInvariant() : text;
            var results = new HashSet<string>();
            var node = _root;

            foreach (var ch in processedText)
            {
                while (node != null && !node.Children.ContainsKey(ch))
                    node = node.Failure;

                node = node?.Children.GetValueOrDefault(ch) ?? _root;
                foreach (var output in node.Outputs)
                    results.Add(output);
            }

            var resultList = new List<string>(results);
            _cache[text] = resultList;
            return resultList;
        }

        public async Task<List<string>> SearchParallelAsync(string text, int threshold = 10000)
        {
            if (text.Length < threshold)
                return Search(text);

            var chunkSize = text.Length / Environment.ProcessorCount;
            var tasks = new List<Task<HashSet<string>>>();
            var results = new HashSet<string>();

            for (var i = 0; i < text.Length; i += chunkSize)
            {
                var start = i;
                var length = Math.Min(chunkSize + 100, text.Length - start); // Overlap by 100 chars
                var chunk = text.Substring(start, length);
                
                tasks.Add(Task.Run(() => new HashSet<string>(Search(chunk))));
            }

            var taskResults = await Task.WhenAll(tasks);
            foreach (var result in taskResults)
                results.UnionWith(result);

            return new List<string>(results);
        }

        public void ClearCache() => _cache.Clear();
    }
