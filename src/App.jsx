import { useState } from 'react'
import { Routes, Route, useLocation } from "react-router"
import './App.css'

// PAGES
import Home from './Home'
import Player from './Player'

export default function App() {
  return (
    <div>
      <Routes> 
        <Route path = "/" element = { <Home/>}/>
        <Route path = "/player" element = { <Player/>}/>
      </Routes>
    </div>
  )
}