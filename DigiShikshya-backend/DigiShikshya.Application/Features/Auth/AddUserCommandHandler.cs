using MediatR;
using Microsoft.AspNetCore.Mvc;

public class AddUserCommandHandler(IUserRepository userRepository): IRequestHandler<AddUserCommand, bool>
{


    public async Task<bool> Handle(AddUserCommand request, CancellationToken cancellationToken)
    {
        return await userRepository.AddUserWhenLoggedIn(request.Id);
    }
}