# BILYABITS-ytdl - YouTube Video Downloader

A modern, mobile-first YouTube video downloader built with React and Node.js. Download YouTube videos in various formats (MP4, WebM, MP3) with real-time progress tracking.

## Features

- 🎥 Download YouTube videos in multiple formats (MP4, WebM, MP3)
- 📱 Mobile-first, responsive design
- 🎨 Modern UI with smooth animations
- 📊 Real-time download progress
- 🔍 Real YouTube API integration
- 🎵 Audio-only downloads (MP3)
- 📋 One-click URL pasting
- 🔒 Safe and secure downloads

## Prerequisites

Before running this application, you need:

1. **Node.js** (v16 or higher)
2. **YouTube Data API v3 Key** from Google Cloud Console

## Getting Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key for use in your `.env` file

## Installation

1. Clone the repository:
```bash
git clone https://github.com/carljohnvillavito/bilyabits-ytdl.git
cd bilyabits-ytdl
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

4. Start the backend server:
```bash
npm run server
```

5. In a new terminal, start the frontend development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Paste a YouTube URL** - Copy any YouTube video URL and paste it into the input field
2. **Analyze the video** - Click "Analyze" to fetch video information
3. **Choose format and quality** - Select your preferred format (MP4, WebM, MP3) and quality
4. **Download** - Click "Download Video" to start the download

## Supported Formats

- **MP4** - Standard video format, widely compatible
- **WebM** - Open-source video format, smaller file sizes
- **MP3** - Audio-only format for music and podcasts

## API Endpoints

### GET `/api/video-info/:videoId`
Fetches video information including title, description, thumbnail, duration, views, and available formats.

### POST `/api/download`
Downloads the video in the specified format and quality.

### GET `/api/health`
Health check endpoint to verify server status.

## Project Structure

```
├── src/
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   ├── common/            # Common components (SafeIcon)
│   └── App.jsx            # Main application component
├── server/
│   └── index.js           # Express server
├── package.json
└── README.md
```

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, ytdl-core
- **APIs**: YouTube Data API v3
- **Styling**: Tailwind CSS with custom animations
- **Icons**: React Icons (Feather Icons)

## Development

To run the project in development mode:

1. Start the backend server:
```bash
npm run server
```

2. Start the frontend development server:
```bash
npm run dev
```

## Building for Production

1. Build the frontend:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes only. Please respect YouTube's terms of service and copyright laws when downloading content.

## Disclaimer

This tool is intended for educational and personal use only. Users are responsible for ensuring they have the right to download and use the content. Always respect copyright laws and YouTube's terms of service.

## Support

For support, please open an issue on GitHub or contact the maintainer.

## Author

**Carl John Villavito**
- GitHub: [@carljohnvillavito](https://github.com/carljohnvillavito)
- Facebook: [Carl John Villavito](https://facebook.com/carljohn.villavito)