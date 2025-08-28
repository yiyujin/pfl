import { Link } from "react-router-dom"

export default function Footer(){
    return(
         <div className = "footer">
            <Link to = "/">
                <img style = { { height : "32px" } } src="/teamstamps_logo.png" />
            </Link>
            <p className = "tinyP">Play Forever League</p>
            <p className = "tinyP">Jun - Aug 2025 / Boston, MA</p>
            <img
                src = "https://nevertoolate.com/wp-content/uploads/2014/03/NTLlogo-1.png"
                style = { { height : "32px", paddingRight : "40px" } }
            />
        </div>
    )
}