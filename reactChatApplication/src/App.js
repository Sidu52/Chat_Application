import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoomScreen from './screens/room'
import ChatScreen from './screens/chat'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomScreen />} />
        <Route path="/chat" element={<ChatScreen/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App