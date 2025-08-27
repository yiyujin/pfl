import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import YoutubePlayer from '../components/YoutubePlayer';
import RandomText from "../components/RandomText";
import { ArrowForward, EventAvailable, Stadium, Scoreboard } from '@mui/icons-material';
import { dataPlayers } from "../data/dataPlayers";
import { dataTeams } from "../data/dataTeams";
import { dataStats } from "../data/dataStats";
import { dataGames } from "../data/dataGames";

export default function Player(){
    const { id } = useParams(); // player_id

    // State for games data
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // PARSE DATA
    const data = dataPlayers.results.filter( (item) => item.id === id );
    const playerName = data[0]?.properties.Name.title[0]?.plain_text || "";
    const backNumber = data[0]?.properties.back_number.rich_text[0]?.plain_text || "";

    const teamId = data[0]?.properties.Teams.relation[0]?.id;
    const team = dataTeams.results.filter( (item) => item.id === teamId );
    const teamName = team[0]?.properties.Name.title[0]?.plain_text || "";

    const statsArr = dataStats.results.filter( (item) => (item.properties.player.relation[0]?.id) === id );
    
    const stats = {
        "GP" : String(statsArr[0]?.properties.GP.rich_text[0]?.plain_text || "0"),
        "MIN" : String(statsArr[0]?.properties.MIN.rich_text[0]?.plain_text || "0"),
        "PTS" : String(statsArr[0]?.properties.PTS.formula?.number || 0),
        "FG" : String(statsArr[0]?.properties.FG?.number || 0),
        "FGA" : String(statsArr[0]?.properties.FGA?.number || 0),
        "FGP" : String(statsArr[0]?.properties.FGP.formula?.number || 0),
        "3FG" : String(statsArr[0]?.properties["3FG"]?.number || 0),
        "3FGA" : String(statsArr[0]?.properties["3FGA"]?.number || 0),
        "3FGP" : String(statsArr[0]?.properties["3FGP"].formula?.number || 0),
        "FT" : String(statsArr[0]?.properties.FT?.number || 0),
        "FTA" : String(statsArr[0]?.properties.FTA?.number || 0),
        "FTP" : String(statsArr[0]?.properties.FTP.formula?.number || 0),
    }

    // Use useEffect to filter games data
    useEffect(() => {
        if (!id) return;
        
        setIsLoading(true);
        
        try {
            const filteredGames = dataGames.results.filter((item) => {
                // Add safety checks
                if (!item.properties.players?.relation) return false;
                
                return item.properties.players.relation.some((rel) => rel.id === id);
            });
            
            // Additional filtering to ensure we have valid youtube_id
            const validGames = filteredGames.filter(game => 
                game.properties.youtube_id?.rich_text?.[0]?.plain_text
            );

            console.log("validGames : ", validGames);
            setGames(validGames);
        } catch (error) {
            console.error("Error filtering games:", error);
            setGames([]);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const statsContainerRef = useRef(null);
    const spanRefs = useRef([]);

    useEffect(() => {
        // Wait for the next tick to ensure spans are rendered
        const setupAnimations = () => {
            // Clean up existing triggers
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            
            // Set initial state for all spans
            spanRefs.current.forEach((span) => {
                if (span) {
                    gsap.set(span, { height: "0%" });
                }
            });

            // Create scroll trigger for each span
            spanRefs.current.forEach((span, index) => {
                if (span) {
                    ScrollTrigger.create({
                        trigger: span.parentElement,
                        start: "left right",
                        end: "right left",
                        scroller: statsContainerRef.current,
                        horizontal: true,
                        onEnter: () => {
                            gsap.to(span, {
                                height: span.dataset.targetHeight || "46%",
                                duration: 1.2,
                                ease: "power2.out"
                            });
                        },
                        onLeave: () => {
                            gsap.to(span, {
                                height: "0%",
                                duration: 0.6,
                                ease: "power2.in"
                            });
                        },
                        onEnterBack: () => {
                            gsap.to(span, {
                                height: span.dataset.targetHeight || "46%",
                                duration: 1.2,
                                ease: "power2.out"
                            });
                        },
                        onLeaveBack: () => {
                            gsap.to(span, {
                                height: "0%",
                                duration: 0.6,
                                ease: "power2.in"
                            });
                        }
                    });
                }
            });
        };

        // Delay setup to ensure DOM elements are ready
        const timeoutId = setTimeout(setupAnimations, 100);

        return () => {
            clearTimeout(timeoutId);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [isLoading]); // Add isLoading as dependency

    if (isLoading) {
        return (
            <div className="page">
                <div>Loading player data...</div>
            </div>
        );
    }

    return(
        <div className = "page">
            <div className = "player-header">
                <h1 style = { {lineHeight : "7.5rem" }}>{ backNumber } · { playerName }</h1>
                <p className = "meta">Team : { teamName }</p>
            </div>

            <br/><br/><br/><br/><br/><br/><br/><br/><br/>

            {/* STATS */}
            <hr/>
            <p className = "meta">SEASON STATS</p>

            <br/>
            
            <div className = "season-stats" ref = { statsContainerRef } style = { { width : "100%", overflowX : "scroll", display : "flex", flexDirection : "row", gap : "40px" } }>
                
                {/* NUMBER STATS */}
                <div style = { {  display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center", gap : "8px" } }>
                    <div style = { { border : "1px solid transparent", width : "160px", height : "180px", display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center" } }>
                        <RandomText txt = { stats.GP } fontSize = "100"/>
                    </div>
                    <p className = "meta">Games Played</p>
                </div>

                <div style = { {  display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center", gap : "8px" } }>
                    <div style = { { border : "1px solid transparent", width : "160px", height : "180px", display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center" } }>
                        <RandomText txt = { stats.MIN } fontSize = "100"/>
                    </div>
                    <p className = "meta">Min Played</p>
                </div>

                <div style = { {  display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center", gap : "8px" } }>
                    <div style = { { border : "1px solid transparent", width : "160px", height : "180px", display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center" } }>
                        <RandomText txt = { stats.PTS } fontSize = "100"/>
                    </div>
                    <p className = "meta">Pts</p>
                </div>

                
                {/* PERCENTAGE STATS */}
                <div style = { { display : "flex", flexDirection : "column", alignItems : "center", width : "100%", gap : "8px" } }>
                    <div style={{ display: "flex", flexDirection: "row", width: "320px", height: "180px", background: "", border: "1px solid white" }}>
                        <div style={{ background: "", display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid white" }}>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid white" }}>{ stats.FG }</h3>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>{ stats.FGA }</h3>
                        </div>
                        <div style={{ position : "relative", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style = { { display : "flex", flexDirection : "row", alignItems : "flex-end"} }>
                                <h3 className = "stats-number" style = { { fontSize : "100px" } }>{ stats.FGP }</h3>
                                <p className = "percentage">%</p>
                            </div>
                            <span 
                                ref={(el) => spanRefs.current[0] = el}
                                data-target-height = {`${stats.FGP}%`}
                                style = { { bottom : "0", position : "absolute", width : "100%", height : "0%", background: "white", mixBlendMode: "difference", }}
                            />
                        </div>
                    </div>

                    <p className = "meta">FG / FGA = FG%</p>
                </div>

                <div style = { { display : "flex", flexDirection : "column", alignItems : "center", width : "100%", gap : "8px" } }>
                    <div style={{ display: "flex", flexDirection: "row", width: "320px", height: "180px", background: "", border: "1px solid white" }}>
                        <div style={{ background: "", display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid white" }}>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid white" }}>{ stats["3FG"] }</h3>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>{ stats["3FGA"] }</h3>
                        </div>
                        <div style={{ position : "relative", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style = { { display : "flex", flexDirection : "row", alignItems : "flex-end"} }>
                                <h3 className = "stats-number" style = { { fontSize : "100px" } }>{ stats["3FGP"] }</h3>
                                <p className = "percentage">%</p>
                            </div>
                            <span 
                                ref={(el) => spanRefs.current[1] = el}
                                data-target-height = {`${stats["3FGP"]}%`}
                                style = { { bottom : "0", position : "absolute", width : "100%", height : "0%", background: "white", mixBlendMode: "difference", }}
                            />
                        </div>
                    </div>

                    <p className = "meta">3FG / 3FGA = 3FG%</p>
                </div>

                <div style = { { marginRight : "80px", display : "flex", flexDirection : "column", alignItems : "center", width : "100%", gap : "8px" } }>
                    <div style={{ display: "flex", flexDirection: "row", width: "320px", height: "180px", background: "", border: "1px solid white" }}>
                        <div style={{ background: "", display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid white" }}>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid white" }}>{ stats.FT }</h3>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>{ stats.FTA }</h3>
                        </div>
                        <div style={{ position : "relative", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style = { { display : "flex", flexDirection : "row", alignItems : "flex-end"} }>
                                <h3 className = "stats-number" style = { { fontSize : "100px" } }>{ stats.FTP }</h3>
                                <p className = "percentage">%</p>
                            </div>
                            <span 
                                ref={(el) => spanRefs.current[2] = el}
                                data-target-height = {`${stats.FTP}%`}
                                style = { { bottom : "0", position : "absolute", width : "100%", height : "0%", background: "white", mixBlendMode: "difference", }}
                            />
                        </div>
                    </div>

                    <p className = "meta">FT / FTA = FT%</p>
                </div>
            </div>

            <br/><br/>
            <hr/>
            <p className = "meta">HIGHLIGHTS</p>
            <br/><br/>
            
            {/* VIDEOS */}         
            { games.length > 0 ? (
                games.map( ( item, index ) => (
                    <div key = { index }>
                        <h1>Game</h1>
                
                        {/* GAME INFO */}
                        <div style = { { display: "flex", flexDirection: "row", gap: "16px", alignItems : "center" } }>
                            <p>{ item.properties.Name.title[0].plain_text }</p>
                            <div style={{ display: "flex", flexDirection: "row", gap: "4px", alignItems: "center" }}>
                                <Scoreboard style = { { fontSize: "14px", color: "white" } } />
                                <p className="meta">{ item.properties.score.rich_text[0].plain_text }</p>
                            </div>
                
                            <div style = { { display: "flex", flexDirection: "row", gap: "4px", alignItems: "center" } }>
                                <EventAvailable style = { { fontSize: "14px", color: "white" } }/>
                                <p className="meta">{ item.properties.Date.date.start }</p>
                            </div>
                
                            <div style = { { display: "flex", flexDirection: "row", gap: "4px", alignItems: "center" } }>
                                <Stadium style = { { fontSize: "14px", color: "white" } } />
                                <p className = "meta">{ item.properties.venue.rich_text[0].plain_text }</p>
                            </div>
                        </div>

                        <YoutubePlayer 
                            playerId = { id } 
                            videoId = { item.properties.youtube_id.rich_text[0]?.plain_text } 
                            gameId = { item.id }
                        />
                    </div>
                ))
            ) : (
                // EMPTY STATE
                <div style = { { height : "100vh" } }>I'm sorry, no games recorded for the player.</div>
            )}

        </div>
    )
}