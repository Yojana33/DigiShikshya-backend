using Microsoft.AspNetCore.SignalR;
using DigiShikshya.Infrastructure.Hubs;

namespace DigiShikshya.Infrastructure.Services
{
    public class VideoService
    {
        private readonly IHubContext<VideoHub> _hubContext;
        private readonly IMaterialRepository _materialRepository;

        public VideoService(IHubContext<VideoHub> hubContext, IMaterialRepository materialRepository)
        {
            _hubContext = hubContext;
            _materialRepository = materialRepository;
        }

        public   async Task<Stream> GetVideoStream(Guid videoId)
        {
            var videoData = await _materialRepository.GetVideoContentById(videoId);

            if (videoData != null && videoData.Length > 0)
            {
                // Convert byte array to stream for returning
                return new MemoryStream(videoData);
            }

            return null!; 
        }
    }
}