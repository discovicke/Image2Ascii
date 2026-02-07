FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /build

# Kopiera projekt-filer (från repo root)
COPY src/Image2Ascii/Image2Ascii.csproj src/Image2Ascii/
COPY src/Image2AsciiApi/Image2AsciiApi.csproj src/Image2AsciiApi/

# Restore
RUN dotnet restore src/Image2AsciiApi/Image2AsciiApi.csproj

# Kopiera källkod
COPY src/Image2Ascii/ src/Image2Ascii/
COPY src/Image2AsciiApi/ src/Image2AsciiApi/

# Build
RUN dotnet build src/Image2AsciiApi/Image2AsciiApi.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish src/Image2AsciiApi/Image2AsciiApi.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Image2AsciiApi.dll"]