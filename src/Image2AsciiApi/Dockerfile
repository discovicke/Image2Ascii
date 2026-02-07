FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopiera både API och Library projekt från src/
COPY ["src/Image2AsciiApi/Image2AsciiApi.csproj", "src/Image2AsciiApi/"]
COPY ["src/Image2Ascii/Image2Ascii.csproj", "src/Image2Ascii/"]

# Restore
RUN dotnet restore "src/Image2AsciiApi/Image2AsciiApi.csproj"

# Kopiera all källkod
COPY src/Image2AsciiApi/ src/Image2AsciiApi/
COPY src/Image2Ascii/ src/Image2Ascii/

# Build
WORKDIR /src/src/Image2AsciiApi
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Image2AsciiApi.dll"]