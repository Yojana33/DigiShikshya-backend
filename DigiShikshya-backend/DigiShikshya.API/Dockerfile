FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["DigiShikshya-backend/DigiShikshya.API/DigiShikshya.API.csproj", "DigiShikshya-backend/DigiShikshya.API/"]
RUN dotnet restore "DigiShikshya-backend/DigiShikshya.API/DigiShikshya.API.csproj"
COPY . .
WORKDIR "/src/DigiShikshya-backend/DigiShikshya.API"
RUN dotnet build "DigiShikshya.API.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "DigiShikshya.API.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DigiShikshya.API.dll"]
