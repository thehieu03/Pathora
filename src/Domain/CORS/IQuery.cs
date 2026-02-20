using MediatR;

namespace Domain.CORS;

public interface IQuery<TResponse> : IRequest<TResponse>
{
}
