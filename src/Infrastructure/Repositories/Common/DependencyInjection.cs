
using Application.Common.Interfaces;
using Domain.Common.Repositories;
using Domain.UnitOfWork;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Repositories.Common;

internal static class DependencyInjection
{
    internal static IServiceCollection AddRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOtpRepository, OtpRepository>();

        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IPositionRepository, PositionRepository>();

        services.AddScoped<IFileRepository, FileRepository>();
        services.AddScoped<IMailRepository, MailRepository>();

        services.AddKeyedScoped<ISystemKeyRepository, SystemKeyRepository>("original");
        services.AddScoped<ISystemKeyRepository, SystemKeyRepository>();

        services.AddKeyedScoped<IFunctionRepository, FunctionRepository>("original");
        services.AddScoped<IFunctionRepository, FunctionRepository>();

        services.AddScoped<ITourRepository, TourRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}