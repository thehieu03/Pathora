using System.Reflection;
using Application.Services;
using Domain.Behaviors;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<IFunctionService, FunctionService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IPositionService, PositionService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<ISystemKeyService, SystemKeyService>();
        services.AddScoped<IUserService, UserService>();

        return services;
    }
}