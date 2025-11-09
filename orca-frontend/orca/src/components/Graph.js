import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./Graph.module.css";

// helper function for time
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function Graph({selectedRobot}) {
  // Initialize with one data point
  const [data, setData] = useState([
    { time: getCurrentTime(), signal: 90, battery: 99, garbage: 0 },
  ]);

  // data sim
  useEffect(() => {
    if (selectedRobot !== "Robot Alpha") return;
    
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastData = prevData[prevData.length - 1];

        let newSignal = lastData.signal + (Math.random() * 10 - 5);
        newSignal = Math.max(80, Math.min(100, newSignal));

        let newBattery = Math.max(0, lastData.battery);

        let newGarbage = Math.min(100, lastData.garbage + 0.1);

        const newDataPoint = {
          time: getCurrentTime(),
          signal: newSignal,
          battery: newBattery,
          garbage: newGarbage,
        };

        const updatedData = [...prevData, newDataPoint];
        if (updatedData.length > 50) {
          updatedData.shift();
        }
        return updatedData;
      });
    }, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, [selectedRobot]);

  return (
    <div className={styles.graph}>
      <h3>Graph</h3>
      {selectedRobot !== "Robot Alpha" ? (
        <div style={{ textAlign: "center", marginTop: "50px", fontSize: "24px" }}>
          Disconnected
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" className={styles.chart}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="signal" stroke="#8884d8" />
            <Line type="monotone" dataKey="battery" stroke="#82ca9d" />
            <Line type="monotone" dataKey="garbage" stroke="#964B00" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Graph;
