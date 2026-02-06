# Image2Ascii

A full-stack web application that converts images to ASCII art with real-time customization options.

## Overview

Image2Ascii is a three-tier application consisting of a core conversion library, a RESTful API, and a modern web interface. Users can upload images and instantly see them transformed into ASCII art with various character sets and adjustable parameters.

## Features

- **Multiple ASCII Libraries**: Choose from 15+ character sets including Classic, Detailed, Blocks, Matrix, Cyberpunk, and more
- **Real-time Adjustments**: 
  - Width control
  - Brightness adjustment
  - Gamma correction
  - Color inversion
- **Responsive Web Interface**: Clean, intuitive UI built with Angular
- **Persistent Settings**: Settings are maintained across multiple conversions

## Tech Stack

**Backend**
- .NET 10.0
- ASP.NET Core Web API
- SixLabors.ImageSharp for image processing

**Frontend**
- Angular 21 (standalone components)
- TypeScript
- SCSS styling
- Reactive forms with signals

**Architecture**
- Three-layer design: Core library, API layer, Web client
- RESTful API communication
- FormData-based image upload

## Project Structure

```
Image2Ascii/
├── Image2Ascii/           # Core ASCII conversion library
├── Image2AsciiApi/        # ASP.NET Core Web API
└── Image2AsciiWeb/        # Angular frontend
```

## Getting Started

### Prerequisites
- .NET 10.0 SDK
- Node.js (v18+)
- npm

### Running the Application

**API:**
```bash
cd Image2AsciiApi
dotnet run
```
The API will start on `http://localhost:5071`

**Frontend:**
```bash
cd Image2AsciiWeb
npm install
npm start
```
The web app will be available at `http://localhost:4200`

## How It Works

1. User uploads an image through the web interface
2. Image and settings are sent to the API as FormData
3. Backend processes the image using the selected ASCII library
4. Generated ASCII art is returned and displayed in the browser
5. Users can adjust settings and regenerate instantly

## API Endpoint

`POST /api/ascii`

**Parameters:**
- `image` (file): Image to convert
- `width` (int): Output width in characters
- `brightness` (float): Brightness adjustment (-1.0 to 1.0)
- `gamma` (float): Gamma correction (0.1 to 3.0)
- `asciiLibrary` (string): Selected character set
- `invert` (bool): Invert light/dark values

## ASCII Libraries

The application includes various ASCII character sets optimized for different styles:
- **Classic**: Traditional ASCII art characters
- **Detailed**: Extended character set for high detail
- **Blocks**: Unicode block characters
- **Matrix**: Digital/cyberpunk aesthetic
- And many more...

## Development Notes

- The core library is decoupled and can be used independently
- API supports Swagger/OpenAPI documentation
- Frontend uses Angular's latest features (signals, standalone components)
- Image processing leverages SixLabors.ImageSharp for performance

## License

This project is available for portfolio and educational purposes.
