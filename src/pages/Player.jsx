import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import YoutubePlayer from '../components/YoutubePlayer';

import { ArrowForward, EventAvailable, Stadium, Scoreboard } from '@mui/icons-material';

export default function Player(){
    const statsContainerRef = useRef(null);
    const spanRefs = useRef([]);

    useEffect(() => {
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
                    trigger: span.parentElement, // The parent div containing the span
                    start: "left right", // When left edge of trigger hits right edge of viewport
                    end: "right left", // When right edge of trigger hits left edge of viewport
                    scroller: statsContainerRef.current, // The horizontal scroll container
                    horizontal: true, // Enable horizontal scrolling detection
                    onEnter: () => {
                        gsap.to(span, {
                            height: span.dataset.targetHeight || "46%",
                            duration: 1.2,
                            ease: "power2.out"
                        });
                    },
                    onLeave: () => {
                        // Optional: Reset when scrolling past
                        gsap.to(span, {
                            height: "0%",
                            duration: 0.6,
                            ease: "power2.in"
                        });
                    },
                    onEnterBack: () => {
                        // Re-animate when scrolling back
                        gsap.to(span, {
                            height: span.dataset.targetHeight || "46%",
                            duration: 1.2,
                            ease: "power2.out"
                        });
                    },
                    onLeaveBack: () => {
                        // Optional: Reset when scrolling back past
                        gsap.to(span, {
                            height: "0%",
                            duration: 0.6,
                            ease: "power2.in"
                        });
                    }
                });
            }
        });

        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return(
        <div className = "page">
            <div style = { { } }>
                <h1>22 · James Smith</h1>
                <p className = "meta">Team : Clark Cougars</p>
            </div>

            <br/>

            {/* <div style = { { display : "flex", flexDirection : "row", gap : "16px", alignItems : "center", overflowX : "scroll", width : "100%", height : "100px", borderRadius : "16px", background : "rgba(255, 255, 255, 0.08)"} }>
                <p>FG%</p>
                <p>FG% ..</p>
                <p>FG% .. next</p>
            </div> */}


            {/* STATS */}
            <hr/>
            <p className = "meta">SEASON STATS</p>
            <br/>
            
            <div ref={statsContainerRef} style = { { width : "100%", overflowX : "scroll", display : "flex", flexDirection : "row", gap : "40px" } }>
                
                {/* NUMBER STATS */}
                <div style = { {  display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center", gap : "8px" } }>
                    <div style = { { border : "1px solid transparent", width : "160px", height : "180px", display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center" } }>
                        <h3 className = "stats-number" style = { { fontSize : "100px" } }>8</h3>
                    </div>
                    <p className = "meta">Games Played</p>
                </div>

                <div style = { {  display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center", gap : "8px" } }>
                    <div style = { { border : "1px solid transparent", width : "160px", height : "180px", display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center" } }>
                        <h3 className = "stats-number" style = { { fontSize : "100px" } }>243</h3>
                    </div>
                    <p className = "meta">Min Played</p>
                </div>

                                <div style = { {  display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center", gap : "8px" } }>
                    <div style = { { border : "1px solid transparent", width : "160px", height : "180px", display : "flex", flexDirection : "column", alignItems : "center", justifyContent : "center" } }>
                        <h3 className = "stats-number" style = { { fontSize : "100px" } }>92</h3>
                    </div>
                    <p className = "meta">Pts</p>
                </div>

                
                {/* PERCENTAGE STATS */}
                <div style = { { display : "flex", flexDirection : "column", alignItems : "center", width : "100%", gap : "8px" } }>
                    <div style={{ display: "flex", flexDirection: "row", width: "320px", height: "180px", background: "", border: "1px solid white" }}>
                        <div style={{ background: "", display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid white" }}>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid white" }}>41</h3>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>90</h3>
                        </div>
                        <div style={{ position : "relative", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style = { { display : "flex", flexDirection : "row", alignItems : "flex-end"} }>
                                <h3 className = "stats-number" style = { { fontSize : "100px" } }>46</h3>
                                <p className = "percentage">%</p>
                            </div>
                            <span 
                                ref={(el) => spanRefs.current[0] = el}
                                data-target-height="46%"
                                style = { { bottom : "0", position : "absolute", width : "100%", height : "0%", background: "white", mixBlendMode: "difference", }}
                            />
                        </div>
                    </div>

                    <p className = "meta">FG / FGA = FG%</p>
                </div>

                <div style = { { display : "flex", flexDirection : "column", alignItems : "center", width : "100%", gap : "8px" } }>
                    <div style={{ display: "flex", flexDirection: "row", width: "320px", height: "180px", background: "", border: "1px solid white" }}>
                        <div style={{ background: "", display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid white" }}>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid white" }}>5</h3>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>20</h3>
                        </div>
                        <div style={{ position : "relative", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style = { { display : "flex", flexDirection : "row", alignItems : "flex-end"} }>
                                <h3 className = "stats-number" style = { { fontSize : "100px" } }>25</h3>
                                <p className = "percentage">%</p>
                            </div>
                            <span 
                                ref={(el) => spanRefs.current[1] = el}
                                data-target-height="22%"
                                style = { { bottom : "0", position : "absolute", width : "100%", height : "0%", background: "white", mixBlendMode: "difference", }}
                            />
                        </div>
                    </div>

                    <p className = "meta">3FG / 3FGA = 3FG%</p>
                </div>

                <div style = { { marginRight : "80px", display : "flex", flexDirection : "column", alignItems : "center", width : "100%", gap : "8px" } }>
                    <div style={{ display: "flex", flexDirection: "row", width: "320px", height: "180px", background: "", border: "1px solid white" }}>
                        <div style={{ background: "", display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid white" }}>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid white" }}>5</h3>
                            <h3 className = "stats-number" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>12</h3>
                        </div>
                        <div style={{ position : "relative", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style = { { display : "flex", flexDirection : "row", alignItems : "flex-end"} }>
                                <h3 className = "stats-number" style = { { fontSize : "100px" } }>42</h3>
                                <p className = "percentage">%</p>
                            </div>
                            <span 
                                ref={(el) => spanRefs.current[2] = el}
                                data-target-height="42%"
                                style = { { bottom : "0", position : "absolute", width : "100%", height : "0%", background: "white", mixBlendMode: "difference", }}
                            />
                        </div>
                    </div>

                    <p className = "meta">FT / FTA = FT%</p>
                </div>
            </div>

            <br/><br/>
            <hr/>
            <p className = "meta">HIGHGLIGHTS</p>
            <br/><br/>

            {/* GAME INFO */}
            <h1>Game</h1>
            <div style={{ display: "flex", flexDirection: "row", gap: "16px", alignItems : "center" }}>
                <p>CC vs CGB</p>
                <div style={{ display: "flex", flexDirection: "row", gap: "4px", alignItems: "center" }}>
                    <Scoreboard style={{ fontSize: "14px", color: "white" }} />
                    <p className="meta">62 : 27</p>
                </div>

                <div style={{ display: "flex", flexDirection: "row", gap: "4px", alignItems: "center" }}>
                    <EventAvailable style={{ fontSize: "14px", color: "white" }} />
                    <p className="meta">Aug 6, 2025</p>
                </div>

                <div style={{ display: "flex", flexDirection: "row", gap: "4px", alignItems: "center" }}>
                    <Stadium style={{ fontSize: "14px", color: "white" }} />
                    <p className = "meta">Healy School</p>
                </div>
            </div>
            
            {/* VIDEOS */}

            {/* pass game in parameter */}
            <YoutubePlayer/>

        </div>
    )
}