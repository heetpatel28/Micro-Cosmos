var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => new { message = "Welcome to {{SERVICE_NAME}} on .NET" });
app.MapGet("/health", () => new { status = "healthy" });

var port = Environment.GetEnvironmentVariable("PORT") ?? "{{PORT}}";
app.Run($"http://0.0.0.0:{port}");
