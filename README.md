# ASCII Forge 

![C#](https://img.shields.io/badge/C%23-13.0-239120?logo=csharp&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)

A full-stack web application that transforms images into ASCII art with real-time customization and a retro terminal-inspired interface.

🔗 **Live Demo**: [asciiforge.vercel.app](https://asciiforge.vercel.app)

## Features

<img align="right" src="docs/screenshots/asciiforge-preview.png" width="400" alt="ASCII Forge Preview">

-  **15+ ASCII Libraries**: Classic, Detailed, Blocks, Matrix, Cyberpunk, and more
-  **Real-time Controls**: Width, brightness, gamma, and color inversion
-  **Terminal Aesthetic**: Retro UI with monospace fonts and terminal colors
-  **Responsive Design**: Works seamlessly on desktop and mobile
-  **API Health Monitoring**: Visual status banners for backend connectivity
-  **Export Ready**: Save your ASCII creations

## Architecture

**Three-tier design with clear separation:**
```
Image2Ascii/
├── src/
│   ├── Image2Ascii/       # Core conversion library
│   ├── Image2AsciiApi/    # ASP.NET Core Web API
│   └── Image2AsciiWeb/    # Angular frontend
```

- **Core Library**: Standalone image-to-ASCII conversion logic
- **API**: RESTful backend exposing conversion endpoints
- **Frontend**: Modern Angular SPA with reactive forms

## Quick Start

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- npm 11.7+

### Local Development

**Backend:**
```bash
cd src/Image2AsciiApi
dotnet run
# API runs on http://localhost:5071
```

**Frontend:**
```bash
cd src/Image2AsciiWeb
npm install
npm start
# App runs on http://localhost:4200
```

## Deployment

- **Frontend**: [Vercel](https://vercel.com) - Always-on CDN delivery
- **Backend**: [Render](https://render.com) - Dockerized API service

The app intelligently handles API cold starts with status banners and health checks.

## API Reference

### Health Check
```
GET /health
```

### Convert Image
```
POST /api/ascii
Content-Type: multipart/form-data
```

**Parameters:**
- `image` (file): Image to convert
- `width` (number): Character width
- `brightness` (number): -1.0 to 1.0
- `gamma` (number): 0.1 to 3.0
- `asciiLibrary` (string): Character set
- `invert` (boolean): Invert colors

**Response:**
```json
{
  "ascii": "string"
}
```

### CORS
Allowed origins:
- `http://localhost:4200` (development)
- `https://asciiforge.vercel.app` (production)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | .NET 8.0, ASP.NET Core, SixLabors.ImageSharp |
| **Frontend** | Angular 21, TypeScript 5.9, RxJS, SCSS |
| **Testing** | Vitest 4.0 |
| **Deployment** | Docker, Vercel, Render |

## How It Works

1. User uploads image via drag-and-drop or file picker
2. Image and settings sent to API as FormData
3. Backend processes using selected ASCII library
4. Generated ASCII art rendered in terminal-style preview
5. Real-time adjustments with instant regeneration

## Building for Production
```bash
# Frontend
cd src/Image2AsciiWeb
npm run build
# Output: dist/Image2AsciiWeb/browser/

# Backend (Docker)
docker build -f src/Image2AsciiApi/Dockerfile -t ascii-api .
```

## Contributing

This is a portfolio project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Available for portfolio and educational purposes.

---

**Made with ❤️ and ASCII art** | [Report Bug](https://github.com/discovicke/Image2Ascii/issues)
