import React, { useState } from "react";
import styles from "./Sidebar.module.css"; // Import the CSS module
import orcaLogo from "../assets/orca-logo.png";
import { FaPlus, FaMinus, FaSignOutAlt, FaRobot } from "react-icons/fa";

function Sidebar({ setSelectedRobot }) {
  const [robots, setRobots] = useState([
    "Robot Alpha",
    "Robot Delta",
    "Robot Omega",
  ]);
  const [command, setCommand] = useState("");

  const addRobot = () => {
    const newRobotName = `Robot ${robots.length + 1}`;
    setRobots([...robots, newRobotName]);
  };

  const removeRobot = () => {
    if (robots.length > 0) {
      setRobots(robots.slice(0, -1));
    }
  };

  // Function to send command to Node.js server
  const handleCommandSend = async () => {
    if (!command.trim()) return;
    try {
      const response = await fetch(`http://172.20.10.3/${command}`);
      const result = await response.text();
      console.log(result);
    } catch (err) {
      console.error("Error sending command:", err);
    }
    setCommand("");
  };
  

  return (
    <div className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.sidebarHeader}>
        <img src={orcaLogo} alt="Orca Logo" className={styles.orcaLogo} />
      </div>

      {/* Robot List */}
      <ul className={styles.robotList}>
        {robots.map((robot, index) => (
          <li
          key={index}
          className={styles.robotItem}
          onClick={() => setSelectedRobot(robot)} // <-- UPDATE selected robot on click
          style={{ cursor: "pointer" }} // Optional: add pointer cursor
        >
          <FaRobot className={styles.robotIcon} />
          {robot}
        </li>
        ))}
      </ul>

      {/* Add/Remove Robot Button */}
      <div className={styles.splitButton}>
        <button className={styles.addHalf} onClick={addRobot}>
          <FaPlus />
        </button>
        <span className={styles.divider}>/</span>
        <button
          className={styles.removeHalf}
          onClick={removeRobot}
          disabled={robots.length === 0}
        >
          <FaMinus />
        </button>
      </div>

      {/* Bottom Buttons */}
      <div className={styles.sidebarFooter}>
        <div className={styles.commandContainer}>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommandSend();
              }
            }}
            placeholder="Enter command..."
            className={styles.commandInput}
          />
          <button onClick={handleCommandSend} className={styles.commandBtn}>
            Send
          </button>
        </div>
        <button className={`${styles.sidebarBtn} ${styles.logout}`}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
