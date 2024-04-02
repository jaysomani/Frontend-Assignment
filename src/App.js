// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import LogsPage from './pages/LogsPage';
import MetricsPage from './pages/MetricsPage'; // Assuming the correct path to MetricsPage

function App() {
  const [timeRange, setTimeRange] = useState(5); // State to track selected time range

  const handleTimeRangeChange = (value) => {
    setTimeRange(value); // Update the selected time range state
  };

  return (
    <Router>
      <div className="App">
        <Navbar onTimeRangeChange={handleTimeRangeChange} /> {/* Pass the onTimeRangeChange function to Navbar */}
        <Routes>
          <Route path="/logs" element={<LogsPage timeRange={timeRange} />} /> {/* Pass the timeRange state to LogsPage */}
          <Route path="/metrics" element={<MetricsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
