import React, { useState, useEffect } from 'react';
import { MimicLogs } from '../api-mimic'; // Adjust the path as needed
import './logsPages.css';
import spinnerSvg from '../Assets/Spinner.svg';

const LogsPage = ({ timeRange }) => { // Receive timeRange as a prop
  const [logs, setLogs] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        // Calculate start and end timestamps based on the selected time range
        const endTs = Date.now();
        const startTs = endTs - (timeRange * 60 * 1000); // Convert minutes to milliseconds

        setStartTime(new Date(startTs));
        setEndTime(new Date(endTs));

        const fetchedLogs = await MimicLogs.fetchPreviousLogs({
          startTs,
          endTs,
          limit: 100, // Fetch only the first 100 logs
        });
        setLogs(fetchedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchLogs();

    return () => {
      // Clean up function
    };
  }, [timeRange]); // Run effect whenever timeRange changes

  return (
    <div className="logs-container mt-5 h-screen ">
      <div className=" flex justify-end rounded-md mx-auto mt-2 max-w-7xl">
        <span className="text-black-400 text-sm">Showing logs from {startTime ? startTime.toLocaleString() : ''} - {endTime ? endTime.toLocaleString() : ''}</span>
      </div>
      <div className="bg-black text-white rounded-md mx-auto mb-10 mt-2 max-w-7xl h-screen">
        <div className=" rounded-md flex justify-center items-center mb-2 bg-gray-900 p-1">
          {loading ? (
            <>
              <img src={spinnerSvg} alt="Loading..." />
              <span className="text-white ml-2">Loading previous 100 logs</span>
            </>
          ) : (
            <span className="text-white">Loaded previous 100 logs</span>
          )}
        </div>
        <div className="p-3 h-full overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-2 flex justify-start">
              <div className=" flex border-r border-blue-400 pr-2 mr-2"></div> {/* Vertical line */}
              <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}:</span><span className="ml-2">{log.message.length > 50 ? log.message.substring(0, 90) + '...' : log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
