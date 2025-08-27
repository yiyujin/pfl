import { Routes, Route, useLocation } from "react-router"
import './App.css'

// PAGES
import Home from './pages/Home';
import Player from './pages/Player';
import Gallery from "./pages/Gallery";
import YouTubeClipsApp from './pages/YouTubeClipsApp';
import Footer from "./components/Footer";
import Players from "./pages/Players";

export default function App() {
  return (
    <div style = { { width : "100vw", height : "100vh" } }>
      <Routes> 
        <Route path = "/" element = { <Home/>}/>
        <Route path="/player/:id" element={<Player />} />
        <Route path = "/gallery" element = { <Gallery/>}/>
        <Route path = "/players" element = { <Players/>}/>
        
        <Route path = "/test" element = { <YouTubeClipsApp/>}/>
      </Routes>

      <Footer/>
    </div>
  )
}