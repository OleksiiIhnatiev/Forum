using Forum.Domain.UserAggregate;
using Forum.Infrastructure.Database;
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

        return services
            .AddAutoMapper(typeof(MappingProfile));
    }

}
