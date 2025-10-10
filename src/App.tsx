import Map from "@/components/MapLeaflet";
import "@/App.css";
import { useState } from "react";
import { type MapName, type Floor } from "@/types/MapTypes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
    const [mapName, setMapName] = useState<MapName>("chalet");
    const [floor, setFloor] = useState<Floor>("basement");

    return (
        <>
            <Navbar onMapSelected={setMapName} onFloorSelected={setFloor} />
            <div className="flex h-screen flex-row pt-12">
                <Sidebar />
                <Map mapName={mapName} floor={floor} />
            </div>
        </>
    );
}

export default App;
