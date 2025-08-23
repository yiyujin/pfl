import { Routes, Route, useLocation } from "react-router"
import './App.css'

// PAGES
import Home from './pages/Home'
import Player from './pages/Player'
import YouTubeClipsApp from './pages/YouTubeClipsApp';

export default function App() {
  return (
    <div>
      <Routes> 
        <Route path = "/" element = { <Home/>}/>
        <Route path="/player/:id" element={<Player />} />
        <Route path = "/test" element = { <YouTubeClipsApp/>}/>
      </Routes>
    </div>
  )
}