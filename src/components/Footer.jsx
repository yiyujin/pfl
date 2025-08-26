import { Link } from "react-router-dom"

// haha

export default function Footer(){
    return(
         <div className = "footer">
            <Link to = "/">
                <img src="/teamstamps_logo.png" className="footerImg" />
            </Link>
            <p>Play Forever League</p>
            <p>Jun - Aug 2025 / Boston, MA</p>
            <img
                src = "https://nevertoolate.com/wp-content/uploads/2014/03/NTLlogo-1.png"
                className = "footerImg"
            />
        </div>
    )
}