import "@/App.css";
import { useState } from "react";
import { type MapName, type Floor } from "@/types/MapTypes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MapKonva from "./components/MapKonva";

function App() {
    const [mapName, setMapName] = useState<MapName>("chalet");
    const [floor, setFloor] = useState<Floor>("basement");

    return (
        <>
            <Navbar onMapSelected={setMapName} onFloorSelected={setFloor} />
            <div className="flex h-screen flex-row pt-12">
                <Sidebar />
                <div className="h-full w-full">
                    <MapKonva mapName={mapName} floor={floor} />
                </div>
            </div>
        </>
    );
}

export default App;
