import { useState } from "react";
import { data, Link } from "react-router-dom";
import RandomText from "../components/RandomText";
import { dataPlayers } from "../data/dataPlayers";

const players = dataPlayers.results;

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  // Extract all valid player names
  const playerNames = players.map(
    (p) => p.properties.Name.title[0].plain_text
  );

  // Check if input matches any player name
  const isMatch = playerNames.some(
    (name) => name.toLowerCase() === inputValue.toLowerCase()
  );

  // Find the matched player object (only needed for the Link)
  const matchedPlayer = players.find(
    (p) =>
      p.properties.Name.title[0].plain_text.toLowerCase() ===
      inputValue.toLowerCase()
  );

  const playerId = matchedPlayer ? matchedPlayer.id : null;

  return (
    <div className="bg-video-wrap">
      <iframe
        className="bg-video"
        src="https://www.youtube.com/embed/oCTuRQQKV2Y?autoplay=1&mute=1&loop=1&playlist=oCTuRQQKV2Y&controls=0&modestbranding=1&showinfo=0"
        allow="autoplay; fullscreen"
        allowFullScreen
      ></iframe>

      <div className="content">
        <div className = "title-container">
          <input
            type="text"
            className="title"
            placeholder="YOUR NAME"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p>Enter your full name to view your highlights</p>

           {isMatch && playerId ? (
              <Link to={`/player/${playerId}`} className="btn btn-red">
                View My Highlights
              </Link>
            ) : (
              <button className="btn btn-default" disabled>
                View My Highlights
              </button>
            )}

          <div style = { { display : "flex", flexDirection : "row", gap : "40px" } }>
            <Link to={`/players`}>
              View Players
            </Link>
            <Link to={`/gallery`}>
              View Photos
            </Link>
          </div>

        </div>

        <div style={ { position : "absolute", bottom : "16%", display : "flex", flexDirection : "column", alignItems : "center", gap : "40px", } }>
          <div className="stats-container">
            <div className="stats">
              <RandomText txt="6" fontSize = "var(--stats-font-size)" />
              <h3>Teams</h3>
            </div>

            <div className="stats">
              <RandomText txt="53" fontSize="var(--stats-font-size)" />
              <h3>Players</h3>
            </div>

            <div className="stats">
              <RandomText txt="24" fontSize="var(--stats-font-size)" />
              <h3>Games</h3>
            </div>

            <div className="stats">
              <RandomText txt="2347" fontSize="var(--stats-font-size)" />
              <h3>Pts</h3>
            </div>
          </div>
          
        </div>
      
      </div>
    </div>
  );
}
