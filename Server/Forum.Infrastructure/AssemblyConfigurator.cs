using Forum.Application.CQRS.Commands.Auth.Register;
using Forum.Application.Interfaces.Repositories;
using Forum.Application.Interfaces.Services;
using Forum.Application.Services;
using Forum.Domain.UserAggregate;
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
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ForumContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString(ForumSqlServer)));


        services.AddIdentity<User, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ForumContext>();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RegisterCommandHandler).Assembly));


        return services
            .AddAutoMapper(typeof(MappingProfile))
            .AddServices()
            .AddRepositories();
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
}
