import { useState } from "react";
import { Link } from "react-router-dom";
import RandomText from "../components/RandomText";
import { dataPlayers } from "../data/dataPlayers";

const supportedTeams = [
  "246afaf7-b684-809a-b5d3-f7ad40ebc10f", // CC
  "232afaf7-b684-80e1-a49e-e3218119fd68", // SCP
  "23fafaf7-b684-8002-b33a-eef8d0e0577d", // SRS
  "24aafaf7-b684-80df-98eb-c1640505d7f1", // EL
  "1a7afaf7-b684-8080-98c8-c527d723323b", // CGB
];

// filter players by supported teams
const filteredPlayers = dataPlayers.results.filter((item) =>
  supportedTeams.includes(item.properties.Teams.relation[0].id)
);

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  // Extract all valid player names
  const playerNames = filteredPlayers.map(
    (p) => p.properties.Name.title[0].plain_text
  );

  // Check if input matches any player name
  const isMatch = playerNames.some(
    (name) => name.toLowerCase() === inputValue.toLowerCase()
  );

  return (
    <div className="bg-video-wrap">
      <video autoPlay muted loop className="bg-video">
        <source src="/test.mov" />
      </video>

      <div className="content">
        <div className="title-container">
          <input
            type="text"
            className="title"
            placeholder="YOUR NAME"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p>Enter your name to view your highlights</p>
          <Link
            to="/player"
            className={`btn ${isMatch ? "btn-red" : "btn-default"}`}
          >
            View Highlights
          </Link>
        </div>

        <div className="stats-container">
          <div className="stats">
            <RandomText txt="9" fontSize="56" />
            <h3>Teams</h3>
          </div>

          <div className="stats">
            <RandomText txt="53" fontSize="56" />
            <h3>Players</h3>
          </div>

          <div className="stats">
            <RandomText txt="24" fontSize="56" />
            <h3>Games</h3>
          </div>

          <div className="stats">
            <RandomText txt="2347" fontSize="56" />
            <h3>Pts</h3>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <img src="/teamstamps_logo.png" className="footerImg" />
          <p>Play Forever League</p>
          <p>Jun - Aug 2025 / Boston, MA</p>
          <img
            src="https://nevertoolate.com/wp-content/uploads/2014/03/NTLlogo-1.png"
            className="footerImg"
          />
        </div>
      </div>
    </div>
  );
}
