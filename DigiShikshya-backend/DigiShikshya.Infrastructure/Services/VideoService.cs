using Microsoft.AspNetCore.SignalR;
using DigiShikshya.Infrastructure.Hubs;

namespace DigiShikshya.Infrastructure.Services
{
    public class VideoService
    {
        private readonly IHubContext<VideoHub> _hubContext;

        public VideoService(IHubContext<VideoHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public   async Task<Stream> GetVideoStream(byte[] videoData)
        {

            if (videoData != null && videoData.Length > 0)
            {
                // Convert byte array to stream for returning
                return new MemoryStream(videoData);
            }

            return null!; 
        }
    }
}