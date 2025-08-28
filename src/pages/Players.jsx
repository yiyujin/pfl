import { useEffect } from "react";
import { dataPlayers } from "../data/dataPlayers";
import { dataHighlights } from "../data/dataHighlights";
import { Link } from "react-router-dom";

// PARSE DATA - PLAYERS
let players = dataPlayers.results;

let groupedByTeam = players.reduce((acc, player) => {
  const teamId = player.properties.Teams.relation[0].id;
  const teamName = player.properties.Rollup.rollup.array[0]?.title[0]?.plain_text;

  if (!acc[teamId]) {
    acc[teamId] = { teamName, players: [] };
  }
  acc[teamId].players.push(player);

  return acc;
}, {});

// PARSE DATA - HIGHLIGHTS
let groupedByPlayer = dataHighlights.reduce((acc, highlight) => {
  const playerId = highlight.properties.player_id.rich_text[0]?.plain_text;
  if (!acc[playerId]) {
    acc[playerId] = [];
  }
  acc[playerId].push(highlight);

  return acc;
}, {});

// 1️⃣ Sort teams by name (Z → A)
groupedByTeam = Object.fromEntries(
  Object.entries(groupedByTeam).sort((a, b) => {
    const nameA = a[1].teamName.toLowerCase();
    const nameB = b[1].teamName.toLowerCase();
    if (nameA < nameB) return 1;
    if (nameA > nameB) return -1;
    return 0;
  })
);

// 2️⃣ Sort players inside each team by most highlights
Object.values(groupedByTeam).forEach(group => {
  group.players.sort((a, b) => {
    const highlightsA = (groupedByPlayer[a.id] || []).length;
    const highlightsB = (groupedByPlayer[b.id] || []).length;
    return highlightsB - highlightsA; // descending
  });
});

export default function Players() {
  useEffect(() => {
    function checkWrap() {
      const lists = document.querySelectorAll(".playername-list");

      lists.forEach(list => {
        const first = list.children[0];
        const second = list.children[1];
        if (!first || !second) return;

        if (first.offsetTop !== second.offsetTop) {
          second.classList.add("wrapped");
        } else {
          second.classList.remove("wrapped");
        }
      });
    }

    // Run initially + on resize
    checkWrap();
    window.addEventListener("resize", checkWrap);
    return () => window.removeEventListener("resize", checkWrap);
  }, []);

  return (
    <div className = "page">
      <h1>All Players</h1>
      <br /><br /><br />

      { Object.entries(groupedByTeam).map( ( [teamId, group] ) => (
        <div key = { teamId } style = { { paddingBottom: "80px" } }>
          <h3>{ group.teamName }</h3>

          { group.players.map((player, i) => {
            const playerId = player.id;
            const playerHighlights = groupedByPlayer[playerId] || [];

            return (
              <Link key = { i } to = {`/player/${playerId}`}>
                <div className = "playername-list">
                  <div style = { { gap: "0" }} >
                    <h1 style={{ width : "var(--font-size-large)", opacity: 0.08 }}>
                      {player.properties.back_number.rich_text[0]?.plain_text}
                    </h1>
                    <h1>{player.properties.first_name.rich_text[0]?.plain_text}</h1>
                  </div>

                  <div className="second-child">
                    <h1>{player.properties.last_name.rich_text[0]?.plain_text}</h1>
                    {playerHighlights.length > 0 && (
                      <div
                        style={{
                          background: "#ff461cff",
                          color: "white",
                          fontWeight: "900",
                          padding: "0px 16px",
                          height: "24px",
                          display: "flex",
                          alignItems : "center",
                          textAlign: "center",
                          borderRadius : 100,
                        }}
                      >
                        <p>{playerHighlights.length}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>

            );
          })}
        </div>
      ))}
    </div>
  );
}
