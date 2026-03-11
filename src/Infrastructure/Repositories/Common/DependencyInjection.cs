
using Application.Common.Interfaces;
using Contracts.Interfaces;
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
        services.AddScoped<ITourInstanceRepository, TourInstanceRepository>();
        services.AddScoped<IDynamicPricingTierRepository, DynamicPricingTierRepository>();

        services.AddScoped<IReviewRepository, ReviewRepository>();

        services.AddScoped<ITourRequestRepository, TourRequestRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<ICustomerDepositRepository, CustomerDepositRepository>();
        services.AddScoped<ICustomerPaymentRepository, CustomerPaymentRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IRegisterRepository, RegisterRepository>();

        return services;
    }
}

