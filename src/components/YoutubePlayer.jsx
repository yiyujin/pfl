import { useState, useEffect, useRef, useCallback } from 'react';
import { data } from '../mockdata.js';
import { ArrowBack, ArrowForward, PlayArrow, Pause } from '@mui/icons-material';

const game = {

}

const typeOrder = [
  "3pt M",
  "2pt M",
  "1pt M",
  "3pt A",
  "2pt A",
  "1pt A"
];

const YouTubePlayer = ({ videoId, onPlayerReady, onStateChange }) => {
  const playerRef = useRef(null);
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
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    const initializePlayer = () => {
      if (!videoId) return;

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      playerRef.current = new window.YT.Player('main-youtube-player', {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 1,
          fs: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          cc_load_policy: 0,
          playsinline: 1,
          widget_referrer: window.location.href,
        },
        events: {
          onReady: (event) => {
            if (onPlayerReadyRef.current) onPlayerReadyRef.current(event.target);
          },
          onStateChange: (event) => {
            if (onStateChangeRef.current) onStateChangeRef.current(event);
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [videoId]);

  return (
    <div style = { { position: 'relative', paddingTop: '56.25%', width: '100%' } }>
      <div
        id = "main-youtube-player"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default function YoutubePlayer() {
  const [videoId, setVideoId] = useState('5zCAljRV7Ls');
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [clipProgress, setClipProgress] = useState(0);

  const currentHighlightIndexRef = useRef(currentHighlightIndex);
  const intervalRef = useRef(null);
  const clipDuration = 8;

  // DATA
  const initialHighlightsData = data.filter( (item) => item.player_id === '246afaf7-b684-80fd-a00f-dd7cf7d6d213').sort((a, b) => { const indexA = typeOrder.indexOf(a.type); const indexB = typeOrder.indexOf(b.type); return indexA - indexB; });
  const [highlightsData, setHighlightsData] = useState(initialHighlightsData);
  
  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === "TIME") {
        const sorted = [...highlightsData].sort(
        (a, b) => a.time_in_seconds - b.time_in_seconds
        );

        setHighlightsData(sorted);
        setCurrentHighlightIndex(0);
        currentHighlightIndexRef.current = 0;
    } else if (value === "TYPE") {
        const sorted = [...highlightsData].sort((a, b) => {
        const indexA = typeOrder.indexOf(a.type);
        const indexB = typeOrder.indexOf(b.type);
        return indexA - indexB;
        });

        setHighlightsData(sorted);
        setCurrentHighlightIndex(0);
        currentHighlightIndexRef.current = 0;
    }
    };

  useEffect(() => {
    currentHighlightIndexRef.current = currentHighlightIndex;
  }, [currentHighlightIndex]);

  const onPlayerReady = useCallback((ytPlayer) => {
    setPlayer(ytPlayer);
    setIsReady(true);
  }, []);

  const onStateChange = useCallback(
    (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) startTimeTracking();
      else stopTimeTracking();
      setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    },
    []
  );

  const seekToHighlight = useCallback(
    (index) => {
      if (player && highlightsData[index]) {
        const startTime = parseInt(highlightsData[index].time_in_seconds) - 5;
        player.seekTo(startTime, true);
        setCurrentTime(startTime);
        setClipProgress(0);
      }
    },
    [player]
  );

  const startTimeTracking = useCallback(() => {
    stopTimeTracking();
    intervalRef.current = setInterval(() => {
      if (!player || typeof player.getCurrentTime !== 'function') return;

      const current = player.getCurrentTime();
      setCurrentTime(current);

      const idx = currentHighlightIndexRef.current;
      const highlight = highlightsData[idx];
      if (!highlight) return;

      const startTime = parseInt(highlight.time_in_seconds) - 5;
      const elapsed = Math.max(0, current - startTime);
      setClipProgress(elapsed);

    //   console.log(currentHighlightIndexRef, elapsed); // DEBUG

      if (elapsed >= clipDuration) {
        stopTimeTracking();

        const nextIndex = (idx + 1) % highlightsData.length;
        currentHighlightIndexRef.current = nextIndex;
        setCurrentHighlightIndex(nextIndex);
        seekToHighlight(nextIndex);

        setTimeout(() => {
          if (player.getPlayerState() === window.YT.PlayerState.PLAYING) startTimeTracking();
        }, 200);
      }
    }, 100);
  }, [player, clipDuration, seekToHighlight]);

  const stopTimeTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => stopTimeTracking, [stopTimeTracking]);

  const handlePlay = () => {
    seekToHighlight(currentHighlightIndex);
    if (player) player.playVideo();
  };

  const handlePause = () => player && player.pauseVideo();

const handleHighlightClick = (index) => {
  const highlight = highlightsData[index]; // always get from current sorted array
  if (!highlight) return;

  setCurrentHighlightIndex(index);
  currentHighlightIndexRef.current = index;

  if (player) {
    const startTime = parseInt(highlight.time_in_seconds) - 5;
    player.seekTo(startTime, true);
    setCurrentTime(startTime);
    setClipProgress(0);

    if (isPlaying) player.playVideo();
  }
};

  const handlePrevious = () => {
    const prevIndex = currentHighlightIndex > 0 ? currentHighlightIndex - 1 : highlightsData.length - 1;
    setCurrentHighlightIndex(prevIndex);
    seekToHighlight(prevIndex);
    if (isPlaying && player) player.playVideo();
  };

  const handleNext = () => {
    const nextIndex = (currentHighlightIndex + 1) % highlightsData.length;
    setCurrentHighlightIndex(nextIndex);
    seekToHighlight(nextIndex);
    if (isPlaying && player) player.playVideo();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (clipProgress / clipDuration) * 100;
  const currentHighlight = highlightsData[currentHighlightIndex];

  return (
    <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative bg-black">
                {!isReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <div className="text-white">Loading video...</div>
                    </div>
                  </div>
                )}

                <YouTubePlayer videoId={videoId} onPlayerReady={onPlayerReady} onStateChange={onStateChange} />
              </div>

            {/* Controls */}
            <div className = "control-buttons" style = { { width : "100%", display : "flex", flexDirection : "row", marginTop : "1px" } }>
                <button onClick={handlePrevious} disabled={!isReady}><ArrowBack/></button>

                {!isPlaying ? (
                    <button onClick={handlePlay} disabled={!isReady}><PlayArrow/></button>
                ) : (
                    <button onClick={handlePause}><Pause/></button>
                )}

                <button onClick={handleNext} disabled={!isReady}><ArrowForward/></button>
            </div>

                {/* PROGRESS BAR */}
                

                <div style = { { width: "100%", background: "rgba(255, 255, 255, 0.04)", height: "4px" }}>
                    <div style = { { background: "rgba(255, 255, 255, 0.4)", height: "100%", width: `${Math.min(progressPercentage, 100)}%`, transition: "width 0.1s linear" }}/>
                </div>
                <p className = "meta">playing {currentHighlightIndex + 1}/{highlightsData.length}.. ({formatTime(clipProgress)} / {formatTime(clipDuration)})</p>


              
            </div>
        </div>

        {/* Highlights List */}
        <br/>
        <div style = { { display : "flex", flexDirection : "row" } }>
            <h3 style = { { flex : 1 } }>Highlights ({highlightsData.length})</h3>
            <select
                style={{ width: "160px", height : "28px" }}
                onChange={handleSortChange}
            >
                <option value="TYPE">sort by TYPE</option>
                <option value="TIME">sort by TIME</option>
            </select>
        </div>

        <div style = { { width : "100%", height : "100px", overflowX : "scroll", display : "flex", flexDirection : "row", gap : "4px" } }>
            { highlightsData.map( ( highlight, index ) => (
                <button
                key = { index }
                onClick = { () => handleHighlightClick(index) }
                style = { { width : "100px", opacity : index === currentHighlightIndex ? 1 : 0.5 } }
                className = "button-highlight"
                >
                <div>
                    <h3>{ highlight.type }</h3>
                    <p className = "meta">{ highlight.time }</p>
                </div>
                </button>
            ))}
        </div>

        </div>
    </div>
  );
}
