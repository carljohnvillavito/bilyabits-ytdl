import {NextRequest, NextResponse} from 'next/server';
import ytdl from '@distube/ytdl-core';
import {PassThrough} from 'stream';

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');
    const itag = req.nextUrl.searchParams.get('itag');
    const title = req.nextUrl.searchParams.get('title') || 'video';

    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    if (!itag) {
        return NextResponse.json({ error: 'Missing itag' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const format = info.formats.find(f => f.itag === parseInt(itag, 10));

    if (!format) {
        return NextResponse.json({ error: 'Format not found' }, { status: 400 });
    }
    
    const readable = ytdl(url, { quality: itag });
    const passThrough = new PassThrough();
    readable.pipe(passThrough);

    const safeTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
    
    // Determine file extension. Audio formats often use 'webm' or 'm4a' (which ytdl reports as 'mp4').
    let fileExtension = format.container || 'mp4';
    if (format.mimeType?.includes('audio/mp4')) {
      fileExtension = 'm4a';
    } else if (format.mimeType?.includes('audio/webm')) {
      fileExtension = 'webm';
    } else if (format.container === 'mp4' && !format.hasVideo) {
      fileExtension = 'm4a';
    }

    const contentDisposition = `attachment; filename="${safeTitle}.${fileExtension}"`;

    const headers = new Headers();
    headers.set('Content-Disposition', contentDisposition);
    headers.set('Content-Type', format.mimeType || 'application/octet-stream');
    if (format.contentLength) {
        headers.set('Content-Length', format.contentLength);
    }
    
    return new NextResponse(passThrough as any, { headers });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Download failed: ${errorMessage}` }, { status: 500 });
  }
}
