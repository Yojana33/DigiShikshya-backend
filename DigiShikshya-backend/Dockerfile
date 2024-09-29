# Use the .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the solution file and projects to the container
COPY ["DigiShikshya.sln", "./"]
COPY ["DigiShikshya.API/DigiShikshya.API.csproj", "DigiShikshya.API/"]
COPY ["DigiShikshya.Application/DigiShikshya.Application.csproj", "DigiShikshya.Application/"]
COPY ["DigiShikshya.Infrastructure/DigiShikshya.Infrastructure.csproj", "DigiShikshya.Infrastructure/"]
COPY ["DigiShikshya.Persistence/DigiShikshya.Persistence.csproj", "DigiShikshya.Persistence/"]
COPY ["DigiShikshya.Domain/DigiShikshya.Domain.csproj", "DigiShikshya.Domain/"]

# Clean and restore the dependencies for the projects
RUN dotnet clean
RUN dotnet restore "DigiShikshya.API/DigiShikshya.API.csproj"

# Copy the rest of the source code to the container
COPY . .

# Set the working directory to the API project
WORKDIR "/src/DigiShikshya.API"

# Build and publish the API project
RUN dotnet publish "DigiShikshya.API.csproj" -c Release -o /app/publish

# Use the ASP.NET Core runtime image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Copy any additional assets like migration scripts if needed (optional)
COPY --from=build /src/DigiShikshya.Persistence/Migration /app/Migration

# Expose the port your application listens on (if different from 80)
EXPOSE 80

# Set the entry point to run your API project
ENTRYPOINT ["dotnet", "DigiShikshya.API.dll"]
