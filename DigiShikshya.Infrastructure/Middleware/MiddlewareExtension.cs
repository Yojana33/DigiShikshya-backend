using Microsoft.AspNetCore.Builder;

namespace DigiShikshya.Infrastructure.Middleware
{
	public static class MiddlewareExtensions
	{
		public static IApplicationBuilder UseLoggingMiddleware(this IApplicationBuilder builder)
		{
			return builder.UseMiddleware<LoggingMiddleware>();
		}
	}
}