# Stage 1: Base runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS base
WORKDIR /app
EXPOSE 8080

# Create non-root user for runtime
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project metadata first for better layer caching
COPY ["Directory.Packages.props", "./"]
COPY ["Directory.Build.props", "./"]
COPY ["nuget.config", "./"]
COPY ["src/Api/Api.csproj", "src/Api/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
COPY ["Share/BuildingBlocks/BuildingBlocks.csproj", "Share/BuildingBlocks/"]
COPY ["Share/Common/Common.csproj", "Share/Common/"]
COPY ["Share/Contracts/Contracts.csproj", "Share/Contracts/"]
COPY ["Share/EventSourcing/EventSourcing.csproj", "Share/EventSourcing/"]

RUN dotnet restore "src/Api/Api.csproj"

# Copy full source after restore
COPY . .
WORKDIR /src/src/Api

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

# Stage 4: Development image (replaces old Dockerfile.dev)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dev
WORKDIR /app

# Keep restore cached in dev builds too
COPY ["Directory.Packages.props", "./"]
COPY ["Directory.Build.props", "./"]
COPY ["nuget.config", "./"]
COPY ["src/Api/Api.csproj", "src/Api/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
COPY ["Share/BuildingBlocks/BuildingBlocks.csproj", "Share/BuildingBlocks/"]
COPY ["Share/Common/Common.csproj", "Share/Common/"]
COPY ["Share/Contracts/Contracts.csproj", "Share/Contracts/"]
COPY ["Share/EventSourcing/EventSourcing.csproj", "Share/EventSourcing/"]
RUN dotnet restore "src/Api/Api.csproj"

COPY . .
EXPOSE 8080 8081
CMD ["dotnet", "run", "--project", "src/Api/Api.csproj"]

# Stage 5: Final production image
FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .
RUN chown -R appuser:appgroup /app

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "Api.dll"]
