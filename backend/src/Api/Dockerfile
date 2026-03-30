# Stage 1: Runtime (Nhân chạy thực tế)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER root
RUN apt-get update && apt-get install -y libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Luôn chạy Production để CORS đọc env var
ENV ASPNETCORE_ENVIRONMENT=Production

# Stage 2: Build (Giai đoạn xây dựng)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# PHẢI COPY CÁC FILE CẤU HÌNH NÀY TRƯỚC
COPY ["Directory.Packages.props", "."]
COPY ["Directory.Build.props", "."]
COPY ["nuget.config", "."]

# PHẢI COPY TẤT CẢ FILE CSPROJ ĐỂ RESTORE
COPY ["src/Api/Api.csproj", "src/Api/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["Share/BuildingBlocks/BuildingBlocks.csproj", "Share/BuildingBlocks/"]
COPY ["Share/Common/Common.csproj", "Share/Common/"]
COPY ["Share/Contracts/Contracts.csproj", "Share/Contracts/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]

# BÂY GIỜ MỚI CHẠY RESTORE
RUN dotnet restore "./src/Api/Api.csproj"

# SAU ĐÓ MỚI COPY TOÀN BỘ SOURCE CODE
COPY . .
WORKDIR "/src/src/Api"
RUN dotnet build "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final (Bàn giao)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]