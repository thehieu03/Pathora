using Application.Features.Identity.Commands;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Contracts.Identity
{
    public sealed record ConfirmRegisterRequest(string code);

    //public sealed class ConfirmCommandHandler(IIdentityService identityService)
    //: ICommandHandler<LogoutCommand, ErrorOr<Success>>
    //{
    //    public async Task<ErrorOr<Success>> Handle(ConfirmCommand request, CancellationToken cancellationToken)
    //    {
    //        return await identityService.ConfirmRegister(new conRequest(request.code));
    //    }
    //}



}
