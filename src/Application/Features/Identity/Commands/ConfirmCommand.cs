using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands
{
    public sealed record ConfirmCommand(string code) : ICommand<ErrorOr<Success>>;

}
