import "@/App.css";
import { useState } from "react";
import { type Floor } from "@/types/MapTypes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MapKonva from "./components/MapKonva";
import MapProvider from "./providers/MapProvider";

function App() {
    const [floor, setFloor] = useState<Floor>("basement");

    return (
        <>
            <MapProvider>
                <Navbar onFloorSelected={setFloor} />
                <div className="flex h-screen flex-row pt-12">
                    <Sidebar />
                    <div className="h-full w-full">
                        <MapKonva floor={floor} />
                    </div>
                </div>
            </MapProvider>
        </>
    );
}

export default App;
