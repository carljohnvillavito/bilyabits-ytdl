import {NextRequest, NextResponse} from 'next/server';
import ytdl from '@distube/ytdl-core';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const sortFormats = (a: any, b: any) => {
    // Attempt to parse qualityLabel as a number (e.g., "720p" -> 720)
    const qualityA = parseInt(a.qualityLabel, 10);
    const qualityB = parseInt(b.qualityLabel, 10);
    if (!isNaN(qualityA) && !isNaN(qualityB)) {
        return qualityB - qualityA;
    }
    // Fallback for non-numeric qualityLabels like "Audio"
    if (a.bitrate && b.bitrate) {
        return b.bitrate - a.bitrate;
    }
    return (b.itag || 0) - (a.itag || 0);
};

const mapAndFilterFormats = (formats: ytdl.videoFormat[]) => {
    return formats
      .filter(f => f.container && (f.qualityLabel || f.audioBitrate) && f.itag)
      .map(format => ({
        quality: format.qualityLabel || `${format.audioBitrate}kbps`,
        format: format.container === 'mp4' && format.hasAudio && !format.hasVideo ? 'm4a' : format.container,
        size: format.contentLength ? formatBytes(parseInt(format.contentLength, 10)) : 'N/A',
        itag: format.itag,
        hasAudio: format.hasAudio,
        hasVideo: format.hasVideo,
        mimeType: format.mimeType,
      }))
      // Deduplicate formats
      .filter((v,i,a)=>a.findIndex(t=>(t.quality === v.quality && t.format === v.format))===i);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid or missing YouTube URL' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        timeout: 60000,
      }
    });

    const videoDetails = info.videoDetails;

    const videoAndAudioFormats = ytdl.filterFormats(info.formats, 'videoandaudio').filter(f => f.container === 'mp4');
    const audioOnlyFormats = ytdl.filterFormats(info.formats, 'audioonly').filter(f => f.mimeType?.includes('audio/mp4'));
    
    const videoInfo = {
      title: videoDetails.title,
      duration: parseInt(videoDetails.lengthSeconds, 10),
      channel: videoDetails.author.name,
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
      videoId: videoDetails.videoId,
      views: videoDetails.viewCount,
      likes: videoDetails.likes,
      formats: {
        videoAndAudio: mapAndFilterFormats(videoAndAudioFormats).sort(sortFormats),
        videoOnly: [],
        audioOnly: mapAndFilterFormats(audioOnlyFormats).sort((a,b) => {
            const bitrateA = parseInt(a.quality);
            const bitrateB = parseInt(b.quality);
            if (!isNaN(bitrateA) && !isNaN(bitrateB)) {
                return bitrateB - bitrateA;
            }
            return (b.itag || 0) - (a.itag || 0)
        }),
      }
    };

    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error('ytdl-core error:', error);
    let errorMessage = 'Failed to fetch video information.';
    if (error instanceof Error) {
      if(error.message.includes('No video id found')) {
        errorMessage = 'Invalid YouTube URL. Please check the link and try again.';
      } else if (error.message.includes('Could not find player config') || error.message.includes('Could not extract signature decipher') || error.message.includes('Could not extract function')) {
        errorMessage = 'Could not retrieve video data. The video might be private, age-restricted, or removed.'
      } else {
        errorMessage = `An error occurred: ${error.message}`;
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
