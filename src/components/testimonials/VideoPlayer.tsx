/**
 * VideoPlayer Component
 * Video player with quality selector (360p, 720p, 1080p)
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  qualities?: {
    '360p': string;
    '720p': string;
    '1080p': string;
  };
  autoplay?: boolean;
  controls?: boolean;
  onQualityChange?: (quality: string) => void;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  qualities,
  autoplay = false,
  controls = true,
  onQualityChange,
}: VideoPlayerProps) {
  const [selectedQuality, setSelectedQuality] = useState<string>('720p');
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    onQualityChange?.(quality);
    
    if (videoRef.current && qualities) {
      const currentTimeBackup = videoRef.current.currentTime;
      videoRef.current.src = qualities[quality as keyof typeof qualities];
      videoRef.current.currentTime = currentTimeBackup;
      videoRef.current.play();
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          className="w-full h-full"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          autoPlay={autoplay}
        >
          Your browser does not support the video tag.
        </video>

        {/* Controls Overlay */}
        {controls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
            {/* Top Controls */}
            <div className="flex justify-between items-start">
              {title && <h3 className="text-white font-medium text-sm">{title}</h3>}
              {qualities && (
                <div className="flex gap-2">
                  {Object.keys(qualities).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleQualityChange(quality)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedQuality === quality
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="space-y-2">
              {/* Progress Bar */}
              <div className="w-full bg-white/30 rounded-full h-1 cursor-pointer group/progress">
                <div
                  className="bg-primary h-1 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-primary transition-colors"
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">🔊</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/30 rounded-full cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-white text-xs ml-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-primary transition-colors"
                >
                  {isFullscreen ? '⛶' : '⛶'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quality Info */}
      {qualities && (
        <div className="text-sm text-muted-foreground">
          Current Quality: <span className="font-medium text-foreground">{selectedQuality}</span>
        </div>
      )}
    </div>
  );
}

