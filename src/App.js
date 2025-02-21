import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./screens/WelcomeScreen";
import MemoryMatch from "./games/MemoryMatch";
import FillInTheBlanks from "./games/FillInTheBlanks";
// Import other game screens when created

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/memory-match" element={<MemoryMatch />} />
        <Route path="/fill-in-the-blanks" element={<FillInTheBlanks />}/>
      </Routes>
    </Router>
  );
}

export default App;
