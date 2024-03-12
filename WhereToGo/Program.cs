var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ProjekatContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ProjekatCS"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("https://localhost:5555",
                           "http://localhost:5555",
                           "https://127.0.0.1:5555",
                           "http://127.0.0.1:5555",
                           "https://localhost:7193",
                           "https://localhost:7193",
                           "http://localhost:5268",
                           "https://localhost:5268",
                           "https://localhost:3000",
                           "http://localhost:3000");
    });
});
builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]?? string.Empty))
        };
    });
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseCors("CORS");

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
