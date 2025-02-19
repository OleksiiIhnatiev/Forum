using AutoMapper;
using Forum.Api;
using Forum.Infrastructure;
using Forum.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.ConfigureWebApiServices().ConfigureInfrastructureServices(builder.Configuration);

builder.Services.AddDbContext<ForumContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ForumSqlServer"))
);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ForumContext>();
    dbContext.Database.Migrate();
}
app.UseStaticFiles();

app.ConfigureWebApi();

app.Run();
var mapper = app.Services.GetRequiredService<IMapper>();
mapper.ConfigurationProvider.AssertConfigurationIsValid();
