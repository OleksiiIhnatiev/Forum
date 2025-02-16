using FluentValidation;
using Forum.Application.AppSettings;
using Forum.Application.CQRS.Commands.Auth.Login;
using Forum.Application.CQRS.Commands.Auth.Logout;
using Forum.Application.CQRS.Commands.Auth.Register;
using Forum.Application.Interfaces.Repositories;
using Forum.Application.Interfaces.Services;
using Forum.Application.Services;
using Forum.Application.Validation;
using Forum.Domain;
using Forum.Infrastructure.Database;
using Forum.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Forum.Infrastructure;

public static class AssemblyConfigurator
{
    private const string ForumSqlServer = "ForumSqlServer";

    public static IServiceCollection ConfigureInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddDbContext<ForumContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString(ForumSqlServer))
        );

        services.AddIdentity<User, IdentityRole<Guid>>().AddEntityFrameworkStores<ForumContext>();

        services.Configure<AuthenticationOptions>(configuration.GetSection("Authentication"));
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(RegisterCommandHandler).Assembly)
        );

        return services
            .AddAutoMapper(typeof(MappingProfile))
            .AddServices()
            .AddRepositories()
            .AddValidators();
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        return services
            .AddScoped<ICommentRepository, CommentRepository>()
            .AddScoped<IAuthRepository, AuthRepository>();
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        return services.AddScoped<IJwtService, JwtService>();
    }

    private static IServiceCollection AddValidators(this IServiceCollection services)
    {
        return services
            .AddScoped<IValidator<LoginCommand>, LoginCommandValidator>()
            .AddScoped<IValidator<LogoutCommand>, LogoutCommandValidator>()
            .AddScoped<IValidator<RegisterCommand>, RegisterCommandValidator>();
    }
}
