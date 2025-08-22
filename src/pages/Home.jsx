import { Link } from "react-router-dom";
import RandomText from "../components/RandomText";

export default function Home(){
    return(
<div className = "bg-video-wrap">
      <video autoPlay muted loop className = "bg-video">
        <source src="/test.mov"/>
      </video>

      <div className = "content">
        <div className = "title-container">
          <input type = "text" className = "title" placeholder = "YOUR NAME"></input>
          <p>Enter your name to view your highlights</p>
          <Link to = "/player" className = "btn">View Highlights</Link>
        </div>

        <div className = "stats-container">

          <div className = "stats">
            <RandomText txt = "9" fontSize = "56"/>
            <h3>Teams</h3>
          </div>

          <div className = "stats">
            {/* <p className = "number">53</p> */}
            <RandomText txt = "53" fontSize = "56"/>
            <h3>Players</h3>
          </div>

          <div className = "stats">
            {/* <p className = "number">24</p> */}
            <RandomText txt = "24" fontSize = "56"/>
            <h3>Games</h3>
          </div>

          <div className = "stats">
            <RandomText txt = "2347" fontSize = "56"/>
            <h3>Pts</h3>
          </div>
        </div>

      {/* FOOTER */}
      <div className = "footer">
        <img src = "/teamstamps_logo.png" className = "footerImg"/>
        
        <p>Play Forever League</p>
        
        <p>Jun - Aug 2025 / Boston, MA</p>

        <img src = "https://nevertoolate.com/wp-content/uploads/2014/03/NTLlogo-1.png" className = "footerImg"/>
      </div>



      </div>


    </div>
    )
}