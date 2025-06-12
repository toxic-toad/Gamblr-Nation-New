
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlayCircle, CalendarClock, Users } from 'lucide-react';

// Mock data for other streamers and schedule
const otherLiveStreamers = [
  { id: '1', name: 'ShadowStrikerX', game: 'Cosmic Conquest', viewers: 1250, isLive: true, avatarSeed: 'SSX', twitchUsername: 'shadowstrikerx' },
  { id: '2', name: 'MysticMaven', game: 'Mystic Realms', viewers: 980, isLive: true, avatarSeed: 'MM', twitchUsername: 'mysticmaven' },
  { id: '3', name: 'NeonNinja', game: 'Neon Racer', viewers: 0, isLive: false, scheduledAt: 'Today, 8:00 PM PST', avatarSeed: 'NN', twitchUsername: 'neonninja' },
];

// Define the main streamer for the embed
const mainEmbeddedStreamer = {
  name: 'afterhoursaz',
  game: 'Live!', // You can change this to a specific game if known
  twitchUsername: 'afterhoursaz',
  avatarSeed: 'AH', // Placeholder avatar seed
  isLive: true, // Assume live for the main embed
  viewers: 0, // Viewers can be dynamic or a placeholder
};

export default function LiveStreamPage() {
  // Construct the Twitch embed URL with the specified channel and parent domain
  const twitchEmbedUrl = `https://player.twitch.tv/?channel=${mainEmbeddedStreamer.twitchUsername}&parent=gamblrnation.netlify.app&muted=true`;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <PlayCircle className="mx-auto h-16 w-16 text-accent mb-4 element-glow-accent" />
        <h1 className="text-4xl font-bold text-primary text-glow-primary">Live Streams</h1>
        <p className="text-muted-foreground mt-2">Watch your favorite GamblrNation streamers live in action!</p>
      </div>
      
      <Card className="overflow-hidden glass-card">
        <CardHeader>
          <CardTitle className="text-2xl text-accent">Now Streaming: {mainEmbeddedStreamer.name} - {mainEmbeddedStreamer.game}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-primary/30">
            <iframe
              src={twitchEmbedUrl}
              height="100%"
              width="100%"
              allowFullScreen={true}
              title={`${mainEmbeddedStreamer.name}'s Live Stream`}
              className="border-0"
            ></iframe>
          </div>
           <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40/CCCCCC/333333.png" alt={mainEmbeddedStreamer.name} data-ai-hint="streamer avatar"/>
                <AvatarFallback>{mainEmbeddedStreamer.avatarSeed}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{mainEmbeddedStreamer.name}</span>
            </div>
            {mainEmbeddedStreamer.isLive && (
              <div className="flex items-center gap-1 text-red-500 font-semibold">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                LIVE 
                {/* {mainEmbeddedStreamer.viewers > 0 && `(${mainEmbeddedStreamer.viewers.toLocaleString()} viewers)`} */}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center"><CalendarClock className="mr-3 h-7 w-7 text-primary"/>Stream Schedule & Other Streamers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {otherLiveStreamers.map((streamer) => (
            <Card key={streamer.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-card/50 hover:border-primary/50 transition-colors">
              <div className="flex items-center space-x-4 mb-2 md:mb-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://placehold.co/60x60/CCCCCC/333333.png" alt={streamer.name} data-ai-hint="streamer avatar" />
                  <AvatarFallback className="bg-primary text-primary-foreground">{streamer.avatarSeed}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-accent">{streamer.name}</h3>
                  <p className="text-sm text-muted-foreground">Playing: {streamer.game}</p>
                </div>
              </div>
              <div className="text-right">
                {streamer.isLive ? (
                  <div className="flex items-center text-red-500">
                    <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    LIVE NOW
                  </div>
                ) : (
                  <p className="text-sm text-primary">{streamer.scheduledAt || 'Offline'}</p>
                )}
                <p className="text-xs text-muted-foreground flex items-center justify-end mt-1">
                  <Users className="h-3 w-3 mr-1" /> {streamer.isLive ? `${streamer.viewers.toLocaleString()} Viewers` : 'Waiting for stream'}
                </p>
              </div>
            </Card>
          ))}
           {otherLiveStreamers.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No other streamers currently scheduled.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
