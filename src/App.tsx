import Map from "./components/MapLeaflet";
import "./App.css";
import { useState } from "react";
import type { Floor } from "./types/MapTypes";

function App() {
    const [floor, setFloor] = useState<Floor>("basement");

    return (
        <>
            <div className="flex flex-row gap-2">
                <button
                    className="cursor-pointer"
                    onClick={() => setFloor("basement")}
                >
                    Basement
                </button>
                <button
                    className="cursor-pointer"
                    onClick={() => setFloor("first")}
                >
                    First
                </button>
                <button
                    className="cursor-pointer"
                    onClick={() => setFloor("second")}
                >
                    Second
                </button>
                <button
                    className="cursor-pointer"
                    onClick={() => setFloor("roof")}
                >
                    Roof
                </button>
            </div>
            <Map mapName="chalet" floor={floor} />
        </>
    );
}

export default App;
