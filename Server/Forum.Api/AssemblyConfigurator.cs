using System.Text.Json;
using System.Text.Json.Serialization;

namespace Forum.Api;

public static class AssemblyConfigurator
{
    public static IServiceCollection ConfigureWebApiServices(this IServiceCollection services)
    {
        services
            .AddEndpointsApiExplorer()
            .AddSwaggerGen()
            .AddCors(options =>
            {
                options.AddPolicy(
                    "AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                    }
                );
            })
            .AddControllers()
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.Converters.Add(
                    new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
                )
            );

        return services;
    }

    public static WebApplication ConfigureWebApi(this WebApplication app)
    {
        app.UseCors("AllowAll");

        app.UseRouting();
        app.MapControllers();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();

        return app;
    }
}
