using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;


public class EmailService(IConfiguration configuration)
    {
        private readonly string _smtpServer = configuration["SMTP:Host"]!;
        private readonly int _smtpPort = int.Parse(configuration["SMTP:Port"]!);
        private readonly string _smtpUser = configuration["SMTP:Username"]!;
        private readonly string _smtpPass = configuration["SMTP:Password"]!;

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpClient = new SmtpClient(_smtpServer)
            {
                Port = _smtpPort,
                Credentials = new NetworkCredential(_smtpUser, _smtpPass),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpUser),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
