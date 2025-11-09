import "./App.css";
import Sidebar from "./components/Sidebar";
import StatusPanel from "./components/StatusPanel";
import Map from "./components/Map";
import Graph from "./components/Graph";

import { useState } from "react";

function App() {
  const [selectedRobot, setSelectedRobot] = useState("Robot Alpha")
  return (
    <div className="dashboard">
      <Sidebar setSelectedRobot={setSelectedRobot}/>
      <div className="main-content">
        <StatusPanel selectedRobot={selectedRobot}/>
        <div className="data-section">
          <Map selectedRobot={selectedRobot}/>
          <Graph selectedRobot={selectedRobot}/>
        </div>
      </div>
    </div>
  );
}

export default App;
