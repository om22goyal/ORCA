import React, { useEffect, useRef } from "react";
import imageSrc from "../assets/water.avif"; 
import styles from "./Map.module.css";


function Map({selectedRobot}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (selectedRobot !== "Robot Alpha") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Match JavaScript canvas size with CSS
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  
    // Example: Static path for now
    const path = [
      { x: 50, y: 150 },
      // { x: 100, y: 140 },
      // { x: 150, y: 130 },
      // { x: 200, y: 120 },
      // { x: 250, y: 110 },
    ];

    // Draw the path
    const drawPath = () => {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    };

    // Draw the robot indicator
    const drawIndicator = () => {
      const lastPos = path[path.length - 1];
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(lastPos.x, lastPos.y, 5, 0, Math.PI * 2);
      ctx.fill();
    };
    
    const background = new Image();
    background.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      drawPath();
      drawIndicator();
    };

    // Assign image source after setting up onload
    background.src = imageSrc;
  }, [selectedRobot]);

    return (
      <div className={styles.map}>
        <h3>Live Map</h3>
        {selectedRobot !== "Robot Alpha" ? (
          <div style={{ textAlign: "center", marginTop: "50px", fontSize: "24px" }}>
            Disconnected
          </div>
        ) : (
          <canvas ref={canvasRef} className={styles.canvas} />
        )}
      </div>
    );
  }
  
  export default Map;
  