using System.Collections.Generic;

namespace DigiShikshya.Infrastructure.Algorithms
{
    public class AhoCorasick
    {
        private class Node
        {
            public Dictionary<char, Node> Children { get; } = new Dictionary<char, Node>();
            public Node Failure { get; set; }
            public List<string> Outputs { get; } = new List<string>();
        }

        private readonly Node _root = new Node();

        public void AddPattern(string pattern)
        {
            var node = _root;
            foreach (var ch in pattern)
            {
                if (!node.Children.ContainsKey(ch))
                {
                    node.Children[ch] = new Node();
                }
                node = node.Children[ch];
            }
            node.Outputs.Add(pattern);
        }

        public void Build()
        {
            var queue = new Queue<Node>();
            foreach (var node in _root.Children.Values)
            {
                node.Failure = _root;
                queue.Enqueue(node);
            }

            while (queue.Count > 0)
            {
                var currentNode = queue.Dequeue();
                foreach (var kvp in currentNode.Children)
                {
                    var childNode = kvp.Value;
                    var failureNode = currentNode.Failure;
                    while (failureNode != null && !failureNode.Children.ContainsKey(kvp.Key))
                    {
                        failureNode = failureNode.Failure;
                    }
                    if (failureNode == null)
                    {
                        childNode.Failure = _root;
                    }
                    else
                    {
                        childNode.Failure = failureNode.Children[kvp.Key];
                        childNode.Outputs.AddRange(childNode.Failure.Outputs);
                    }
                    queue.Enqueue(childNode);
                }
            }
        }

        public List<string> Search(string text)
        {
            var node = _root;
            var results = new List<string>();

            foreach (var ch in text)
            {
                while (node != null && !node.Children.ContainsKey(ch))
                {
                    node = node.Failure;
                }
                if (node == null)
                {
                    node = _root;
                    continue;
                }
                node = node.Children[ch];
                results.AddRange(node.Outputs);
            }

            return results;
        }
    }
}