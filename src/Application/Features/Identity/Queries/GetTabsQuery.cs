using Application.Contracts.Identity;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Queries;

public sealed record GetTabsQuery() : IQuery<ErrorOr<List<TabVm>>>;

