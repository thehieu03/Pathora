FROM mcr.microsoft.com/dotnet/runtime:10.0-alpine AS base
WORKDIR /app

RUN addgroup -g 1000 -S appgroup \
    && adduser -u 1000 -S appuser -G appgroup

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Directory.Packages.props", "./"]
COPY ["Directory.Build.props", "./"]
COPY ["nuget.config", "./"]
COPY ["src/Infrastructure.DatabaseMigration/Infrastructure.DatabaseMigration.csproj", "src/Infrastructure.DatabaseMigration/"]
RUN dotnet restore "src/Infrastructure.DatabaseMigration/Infrastructure.DatabaseMigration.csproj"

COPY . .
WORKDIR /src/src/Infrastructure.DatabaseMigration
RUN dotnet publish "Infrastructure.DatabaseMigration.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build --chown=appuser:appgroup /app/publish .
USER appuser

ENTRYPOINT ["dotnet", "Infrastructure.DatabaseMigration.dll"]
