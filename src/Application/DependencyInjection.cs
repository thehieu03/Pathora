using System.Reflection;
using Application.Common.Behaviors;
using Application.Services;
using BuildingBlocks.Behaviors;
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
            cfg.AddOpenBehavior(typeof(CachingBehavior<,>));
            cfg.AddOpenBehavior(typeof(CacheInvalidationBehavior<,>));
        });
        services.AddSingleton<CacheKeyTracker>();
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<IFunctionService, FunctionService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IPositionService, PositionService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<ISystemKeyService, SystemKeyService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITourService, TourService>();
        services.AddScoped<ITourInstanceService, TourInstanceService>();
        services.AddScoped<IDynamicPricingService, DynamicPricingService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IOwnershipValidator, OwnershipValidator>();

        return services;
    }
}
