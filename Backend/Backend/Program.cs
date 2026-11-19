using Microsoft.EntityFrameworkCore;
using Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// services
builder.Services.AddControllers();

// the following code gets the value of the connection string from the appsettings.json
string connectionString = builder.Configuration.GetConnectionString("Default") ?? throw new ArgumentNullException("Connection string is NULL");
builder.Services.AddDbContext<AppDbContext>(op=>op.UseSqlite(connectionString));
var app = builder.Build();

// middlewares
app.MapControllers();

// app.MapGet("/", () => "Hello World!");

app.Run();
