using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace DigiShikshya.Infrastructure.Hubs
{
    public class VideoHub : Hub
    {
        // Method to stream video data to all connected clients
        public async Task StreamVideo(byte[] videoData)
        {
            await Clients.All.SendAsync("ReceiveVideo", videoData);
        }
    }
}