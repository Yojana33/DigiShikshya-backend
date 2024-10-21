using MediatR;
using Microsoft.AspNetCore.Mvc;

public class AddUserCommand : IRequest<bool>
{
    public string Id { get; set; }
}
