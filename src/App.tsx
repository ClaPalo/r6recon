import Map from "@/components/MapLeaflet";
import "@/App.css";
import { useState } from "react";
import { type MapName, type Floor } from "@/types/MapTypes";
import Navbar from "./components/Navbar";

function App() {
    const [mapName, setMapName] = useState<MapName>("chalet");
    const [floor, setFloor] = useState<Floor>("basement");

    return (
        <>
            <Navbar onMapSelected={setMapName} onFloorSelected={setFloor} />
            <div className="h-screen pt-12">
                <Map mapName={mapName} floor={floor} />
            </div>
        </>
    );
}

export default App;
