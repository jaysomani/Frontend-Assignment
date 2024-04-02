import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../Assets/TFlogo.svg';
import list from '../../Assets/list.png';
import metrics from '../../Assets/metrics-gray.png';
import metricsIconActive from '../../Assets/metrics.png';
import listIconActive from '../../Assets/list-active.png';

const Navbar = ({ onTimeRangeChange }) => {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState(5);
  const [isMetricsActive, setIsMetricsActive] = useState(false);
  const [isLogsActive, setIsLogsActive] = useState(false);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    onTimeRangeChange(value);
  };

  const handleMetricsClick = () => {
    setIsMetricsActive(true);
    setIsLogsActive(false);
  };

  const handleLogsClick = () => {
    setIsLogsActive(true);
    setIsMetricsActive(false);
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className={location.pathname === '/' ? 'text-blue-600 underline' : 'text-gray-800 hover:text-blue-600'}>
          <img src={logo} alt="True Foundry Logo" className="h-10" />
        </Link>
        <ul className="flex space-x-4">
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={isMetricsActive ? metricsIconActive : metrics}
              alt="Metrics Icon"
              className="h-5 mr-1"
              onClick={handleMetricsClick}
            />
            <Link
              to="/metrics"
              onClick={handleMetricsClick}
              className={isMetricsActive ? 'underline border-b border-blue-600 pt-1 font-bold rounded ' : 'text-gray-800 hover:text-blue-600'}
            >
              <span>Metrics</span>
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <img src={isLogsActive ? listIconActive : list} alt="Logs Icon" className="h-3 mr-1" onClick={handleLogsClick} />
            <Link
              to="/logs"
              onClick={handleLogsClick}
              className={isLogsActive ? 'underline border-b border-blue-600 pt-1 font-bold rounded ' : 'text-gray-800 hover:text-blue-600'}
            >
              <span>Logs</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="relative">
        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(parseInt(e.target.value))}
          className="appearance-none bg-transparent border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none"
        >
          <option value="5">Last 5 minutes</option>
          <option value="10">Last 15 minutes</option>
          <option value="15">Last 30 minutes</option>
          <option value="15">Last 1 hour</option>
          <option value="15">Last 3 hours</option>
          <option value="15">Last 6 hours</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.293 7.293a1 1 0 0 1 1.414 0L10 9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
