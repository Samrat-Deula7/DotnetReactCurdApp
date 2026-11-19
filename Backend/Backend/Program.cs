using Microsoft.EntityFrameworkCore;
using Backend.Models;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                      });
});


// services
builder.Services.AddControllers();

// the following code gets the value of the connection string from the appsettings.json
string connectionString = builder.Configuration.GetConnectionString("Default") ?? throw new ArgumentNullException("Connection string is NULL");
builder.Services.AddDbContext<AppDbContext>(op => op.UseSqlite(connectionString));
var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

// middlewares
app.MapControllers();

// app.MapGet("/", () => "Hello World!");

app.Run();
