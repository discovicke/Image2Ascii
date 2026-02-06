# Image2Ascii
![C#](https://img.shields.io/badge/C%23-13.0-239120?logo=csharp&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-Web%20API-512BD4)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-Portfolio%20%2F%20Educational-blue)

A full-stack web application that converts images into ASCII art with real-time customization and a clean, modern UI.

## Overview

**Image2Ascii** is a three-tier application designed with clear separation of concerns:

- A core conversion library for image-to-ASCII logic
- A RESTful API exposing the conversion pipeline
- A modern Angular frontend for instant previews and live adjustments

Users can upload an image and see it transformed into ASCII art while tuning visual parameters in real time.


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
