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
                <div className="flex h-screen w-screen flex-col">
                    <Navbar floor={floor} onFloorSelected={setFloor} />
                    <div className="flex w-screen flex-1 flex-row">
                        <div className="h-full">
                            <Sidebar />
                        </div>
                        <div className="min-h-0 min-w-0 flex-1 shrink">
                            <MapKonva floor={floor} />
                        </div>
                    </div>
                </div>
            </MapProvider>
        </>
    );
}

export default App;
