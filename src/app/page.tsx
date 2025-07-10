
"use client";

import { useState, useEffect } from "react";
import { Youtube, Link as LinkIcon, Download, Clapperboard, Timer, User, History, Loader, CheckCircle2, Video, Mic, ThumbsUp, Eye, Menu, Github, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface VideoFormat {
  quality: string;
  format: string;
  size: string;
  itag: number;
}

interface VideoInfo {
  title: string;
  duration: number;
  channel: string;
  thumbnail: string;
  videoId: string;
  views: string;
  likes: number | null;
  formats: {
    videoAndAudio: VideoFormat[];
    videoOnly: VideoFormat[];
    audioOnly: VideoFormat[];
  };
}

interface HistoryItem {
  id: string;
  title: string;
  format: string;
  status: 'completed';
  downloadDate: string; // Storing as string for easier serialization
}

// Facebook icon as an inline SVG component
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);


function formatDuration(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "00:00:00";
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);
}

const FormatTable = ({ formats, selectedItag, onSelectItag, formatType }: { formats: VideoFormat[], selectedItag: string | null, onSelectItag: (itag: string) => void, formatType: 'mp4' | 'm4a' }) => {
  if (!formats || formats.length === 0) {
    return <p className="text-muted-foreground text-sm">No {formatType.toUpperCase()} formats available.</p>
  }
  return (
      <RadioGroup value={selectedItag ?? ""} onValueChange={onSelectItag}>
          <div className="space-y-2">
              {formats.map((format) => (
                  <Label key={format.itag} htmlFor={`format-${format.itag}`} className="flex items-center justify-between p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value={format.itag.toString()} id={`format-${format.itag}`} />
                          <span className="font-semibold">{format.quality}</span>
                          <Badge variant="outline">{format.format}</Badge>
                      </div>
                      <span className="text-muted-foreground">{format.size}</span>
                  </Label>
              ))}
          </div>
      </RadioGroup>
  )
}


export default function Home() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormatItag, setSelectedFormatItag] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('downloadHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
        try {
            localStorage.setItem('downloadHistory', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    }
  }, [history]);
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast({
        title: "Pasted from clipboard!",
        description: "The YouTube URL has been pasted into the input field.",
      });
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({
        title: "Paste Failed",
        description: "Could not paste from clipboard. Please check browser permissions.",
        variant: "destructive",
      });
    }
  };

  const handleFetchVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({ title: "Error", description: "Please enter a YouTube URL.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setVideoInfo(null);
    setSelectedFormatItag(null);
    try {
      const response = await fetch('/api/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch video info');
      }
      const data: VideoInfo = await response.json();
      setVideoInfo(data);
      if (data.formats.videoAndAudio.length > 0) {
        setSelectedFormatItag(data.formats.videoAndAudio[0].itag.toString());
      } else if (data.formats.audioOnly.length > 0) {
        setSelectedFormatItag(data.formats.audioOnly[0].itag.toString());
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!videoInfo || !selectedFormatItag || !url) {
        toast({ title: "Error", description: "Please select a format to download.", variant: "destructive" });
        return;
    }

    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&itag=${selectedFormatItag}&title=${encodeURIComponent(videoInfo.title)}`;
    window.open(downloadUrl, '_blank');

    const allFormats = [
      ...videoInfo.formats.videoAndAudio, 
      ...videoInfo.formats.videoOnly, 
      ...videoInfo.formats.audioOnly
    ];
    const selectedFormat = allFormats.find(f => f.itag.toString() === selectedFormatItag);

    const newHistoryItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      title: videoInfo.title,
      format: selectedFormat ? `${selectedFormat.quality} ${selectedFormat.format}` : 'N/A',
      status: 'completed',
      downloadDate: new Date().toISOString()
    };
    setHistory(prev => [newHistoryItem, ...prev]);

    toast({ title: "Download Started", description: `${videoInfo.title} is now downloading in a new tab.`});
  };

  const allFormats = videoInfo ? [
    ...videoInfo.formats.videoAndAudio, 
    ...videoInfo.formats.videoOnly, 
    ...videoInfo.formats.audioOnly
  ] : [];
  const selectedFormatDetails = allFormats.find(f => f.itag.toString() === selectedFormatItag);
  const selectedFormatString = selectedFormatDetails ? `${selectedFormatDetails.quality} ${selectedFormatDetails.format}` : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center">
                <Youtube className="h-10 w-10 text-accent" />
                <h1 className="ml-4 text-3xl md:text-4xl font-bold font-headline tracking-tighter">BILYABITS-YTDL</h1>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open contact menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <a href="https://github.com/carljohnvillavito/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                            <Github className="mr-2 h-4 w-4" />
                            <span>GitHub</span>
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                         <a href="https://facebook.com/carljohn.villavito" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                            <FacebookIcon className="mr-2 h-4 w-4" />
                            <span>Facebook</span>
                        </a>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><LinkIcon /> Enter Video URL</CardTitle>
            <CardDescription>Paste a YouTube link below to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFetchVideo} className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-grow text-base pr-10"
                  aria-label="YouTube URL"
                />
                <Button variant="ghost" size="icon" type="button" onClick={handlePaste} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground">
                  <ClipboardPaste className="h-5 w-5"/>
                  <span className="sr-only">Paste from clipboard</span>
                </Button>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto shrink-0">
                {isLoading ? <Loader className="animate-spin mr-2" /> : null}
                {isLoading ? "Fetching..." : "Fetch Video"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
            <div className="flex justify-center items-center my-8">
                <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {videoInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="md:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Video Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoInfo.videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Clapperboard className="w-5 h-5 text-accent"/>{videoInfo.title}</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2"><User className="w-4 h-4" />{videoInfo.channel}</p>
                  <p className="flex items-center gap-2"><Timer className="w-4 h-4" />{formatDuration(videoInfo.duration)}</p>
                  <p className="flex items-center gap-2"><Eye className="w-4 h-4" />{formatNumber(parseInt(videoInfo.views, 10))} views</p>
                  <p className="flex items-center gap-2"><ThumbsUp className="w-4 h-4" />{formatNumber(videoInfo.likes)} likes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Download Options</CardTitle>
                    <CardDescription>Choose your preferred format and quality.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-base font-semibold"><div className="flex items-center gap-2"><Video/> MP4 (Video)</div></AccordionTrigger>
                      <AccordionContent>
                        <FormatTable formats={videoInfo.formats.videoAndAudio} selectedItag={selectedFormatItag} onSelectItag={setSelectedFormatItag} formatType="mp4" />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-base font-semibold"><div className="flex items-center gap-2"><Mic/> M4A (Audio)</div></AccordionTrigger>
                      <AccordionContent>
                        <FormatTable formats={videoInfo.formats.audioOnly} selectedItag={selectedFormatItag} onSelectItag={setSelectedFormatItag} formatType="m4a" />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                   <Button onClick={handleDownload} className="w-full" disabled={!selectedFormatItag}>
                        <Download className="mr-2" /> Download {selectedFormatString}
                    </Button>
                </CardFooter>
            </Card>
          </div>
        )}

        <Card className="shadow-lg mt-8">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><History /> Download History</CardTitle>
                <CardDescription>View your previously downloaded videos.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length > 0 ? (
                            history.map(h => (
                                <TableRow key={h.id}>
                                    <TableCell className="font-medium truncate max-w-xs">{h.title}</TableCell>
                                    <TableCell>{h.format}</TableCell>
                                    <TableCell>{new Date(h.downloadDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Completed
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">No download history yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
