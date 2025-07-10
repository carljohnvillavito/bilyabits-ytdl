# BILYABITS-YTDL

A simple and fast YouTube downloader built with Next.js, allowing you to download videos and audio with ease.

![App Screenshot](https://placehold.co/800x450.png)

## Overview

BILYABITS-YTDL is a web application that provides a user-friendly interface to download YouTube videos. Users can paste a YouTube URL, preview the video along with its details like views and likes, choose from available MP4 (video) or M4A (audio) formats, and download it directly. The application also keeps a history of your downloads using your browser's local storage.

## Features

- **Paste from Clipboard**: Easily paste a YouTube URL with a single click.
- **Live Video Preview**: Watch the video directly on the page before downloading.
- **Rich Video Details**: See the video's title, channel, duration, view count, and likes.
- **Format Selection**: Choose between available MP4 video and M4A audio formats.
- **Download History**: Your past downloads are saved locally for easy reference.
- **Responsive Design**: A clean and modern UI that works on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **YouTube API**: [@distube/ytdl-core](https://github.com/distubejs/ytdl-core)

## Deploy Your Own

You can deploy your own version of BILYABITS-YTDL with a single click on your preferred platform:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/carljohnvillavito/bilyabits-ytdl)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/carljohnvillavito/bilyabits-ytdl)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/carljohnvillavito/bilyabits-ytdl)

### Manual Installation

If you prefer to set up the project manually, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/carljohnvillavito/BILYABITS-YTDL.git
    cd BILYABITS-YTDL
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Platform-Specific Instructions:**

-   **Vercel**: Vercel provides out-of-the-box support for Next.js. Simply link your GitHub repository and it will deploy automatically.
-   **Netlify**: This repository includes a `netlify.toml` file. Netlify will use it to correctly build and deploy the app.
-   **Render**: This repository includes a `render.yaml` file. You can create a new "Blueprint" service on Render and point it to your repository.

## Author

- **Carl John Villavito**
  - **GitHub**: [@carljohnvillavito](https://github.com/carljohnvillavito)
  - **Facebook**: [Carl John Villavito](https://facebook.com/carljohn.villavito)

---

This project was built with assistance from Firebase Studio.
