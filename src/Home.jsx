import { Link } from "react-router-dom"

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
            <p className = "number">9</p>
            <h3>Teams</h3>
          </div>

          <div className = "stats">
            <p className = "number">53</p>
            <h3>Players</h3>
          </div>

          <div className = "stats">
            <p className = "number">24</p>
            <h3>Games</h3>
          </div>

          <div className = "stats">
            <p className = "number">2,016</p>
            <h3>Baskets</h3>
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