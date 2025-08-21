import React, { useState, useEffect, useRef, useCallback } from 'react';

// Sample highlights data
const highlightsData = [
  {
    "pageId": "24aafaf7-b684-8175-a5d7-cd71aebfa7aa",
    "time": "45:59",
    "time_in_seconds": "2759",
    "created_by": "jin",
    "comments": [],
    "type": "1pt A",
    "goaler": "name here",
    "player_id": "246afaf7-b684-80c6-8d3c-c1e0a35ff4f6",
    "isHighlight": "N",
    "team_id": "246afaf7-b684-809a-b5d3-f7ad40ebc10f"
  },
  {
    "pageId": "24aafaf7-b684-8153-acd6-fd75b154fa15",
    "time": "45:43",
    "time_in_seconds": "2743",
    "created_by": "jin",
    "comments": [],
    "type": "1pt M",
    "goaler": "name here",
    "player_id": "246afaf7-b684-80c6-8d3c-c1e0a35ff4f6",
    "isHighlight": "N",
    "team_id": "246afaf7-b684-809a-b5d3-f7ad40ebc10f"
  }
];

// YouTube Player Component
const YouTubePlayer = ({ videoId, startTime, endTime, onPlayerReady, onStateChange, playerId }) => {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const onPlayerReadyRef = useRef(onPlayerReady);
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    onPlayerReadyRef.current = onPlayerReady;
  }, [onPlayerReady]);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      window.onYouTubeIframeAPIReady = initializePlayer;

      if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    const initializePlayer = () => {
      if (!videoId) return;

      // Clean up existing player first
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Create new player
      playerRef.current = new window.YT.Player(`youtube-player-${playerId}`, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          start: startTime,
          end: endTime,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          cc_load_policy: 0,
          playsinline: 1,
          widget_referrer: window.location.href
        },
        events: {
          onReady: (event) => {
            if (onPlayerReadyRef.current) {
              onPlayerReadyRef.current(event.target);
            }
          },
          onStateChange: (event) => {
            if (onStateChangeRef.current) {
              onStateChangeRef.current(event);
            }
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId, startTime, endTime, playerId]);

  return (
    <div style={{ position: "relative", paddingTop: "56.25%", width: "100%" }}>
      <div 
        id={`youtube-player-${playerId}`}
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%" 
        }}
      />
    </div>
  );
};

// Individual Clip Player Component
const YouTubeClipPlayer = ({ videoId, highlight, clipIndex }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef(null);

  const startTime = parseInt(highlight.time_in_seconds) - 5;
  const clipDuration = 8;
  const endTime = startTime + clipDuration;
  const playerId = `${highlight.pageId}-${clipIndex}`;

  const onPlayerReady = useCallback((ytPlayer) => {
    setPlayer(ytPlayer);
    setIsReady(true);
  }, []);

  const onStateChange = useCallback((event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startTimeTracking();
    } else if (event.data === window.YT.PlayerState.PAUSED || 
               event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      stopTimeTracking();
    }
  }, []);

  const startTimeTracking = useCallback(() => {
    stopTimeTracking();
    intervalRef.current = setInterval(() => {
      if (player && typeof player.getCurrentTime === 'function') {
        const current = player.getCurrentTime();
        const elapsed = Math.max(0, current - startTime);
        setCurrentTime(elapsed);
        
        // Stop the video after clip duration
        if (elapsed >= clipDuration) {
          player.pauseVideo();
          setIsPlaying(false);
          stopTimeTracking();
        }
      }
    }, 100);
  }, [player, startTime, clipDuration]);

  const stopTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTimeTracking();
    };
  }, [stopTimeTracking]);

  const handlePlay = () => {
    if (player) {
      // Always seek to start time when playing to ensure we start from the clip beginning
      player.seekTo(startTime, true);
      setCurrentTime(0);
      player.playVideo();
    }
  };

  const handlePause = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  const handleRestart = () => {
    if (player) {
      player.seekTo(startTime, true);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / clipDuration) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-black">
        {!isReady && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer flex items-center justify-center"
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`
            }}
            onClick={handlePlay}
          >
            <div className="bg-black bg-opacity-60 rounded-full px-4 py-2 text-white">
              Play
            </div>
          </div>
        )}
        
        <YouTubePlayer
          videoId={videoId}
          startTime={startTime}
          endTime={endTime}
          onPlayerReady={onPlayerReady}
          onStateChange={onStateChange}
          playerId={playerId}
        />
        
        {/* Overlay with clip info */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs z-10">
          {clipDuration}s Clip • {highlight.time}
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {!isPlaying ? (
              <button 
                onClick={handlePlay}
                disabled={!isReady}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm transition-colors"
              >
                Play
              </button>
            ) : (
              <button 
                onClick={handlePause}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                Pause
              </button>
            )}
            
            <button 
              onClick={handleRestart}
              disabled={!isReady}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded text-sm transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="text-xs text-gray-600">
            {formatTime(currentTime)} / {formatTime(clipDuration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div 
            // className="bg-blue-600 h-1 rounded-full transition-all duration-100 ease-linear"
            style={{ height : "4px", background : "red", width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>

        {/* Highlight Info */}
        <div className="text-xs text-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{highlight.type}</span>
            <span>{highlight.goaler}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Created by {highlight.created_by} • Original time: {highlight.time}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const YouTubeClipsApp = () => {
  const [videoId, setVideoId] = useState("5zCAljRV7Ls");

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          YouTube Clips Player
        </h1>
        
        {/* Video ID Input */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video ID:
          </label>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="Enter YouTube video ID (e.g., 5zCAljRV7Ls)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Clips Grid - renders one player for each highlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlightsData.map((highlight, index) => (
            <YouTubeClipPlayer
              key={`${videoId}-${highlight.pageId}`}
              videoId={videoId}
              highlight={highlight}
              clipIndex={index}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Each highlight gets its own video player</li>
            <li>• Each clip starts 5 seconds before the specified time and plays for 10 seconds total</li>
            <li>• The video automatically stops after the clip duration</li>
            <li>• Use Play, Pause, or Refresh buttons to control each clip independently</li>
            <li>• Change the YouTube video ID to test with different videos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default YouTubeClipsApp;