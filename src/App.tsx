import "@/App.css";
import { useRef, useState } from "react";
import { type Floor } from "@/types/MapTypes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MapKonva from "./components/MapKonva";
import MapProvider from "./providers/MapProvider";
import type { Icon } from "./types/IconTypes";

function App() {
    const [floor, setFloor] = useState<Floor>("basement");
    const draggedIconRef = useRef<Icon>("bomb");

    const handleIconDragStart = (icon: Icon) => {
        draggedIconRef.current = icon;
    };

    return (
        <>
            <MapProvider>
                <div className="flex h-screen w-screen flex-col overflow-hidden">
                    <Navbar floor={floor} onFloorSelected={setFloor} />
                    <div className="flex w-screen flex-1 flex-row">
                        <div className="h-full">
                            <Sidebar handleDragStart={handleIconDragStart} />
                        </div>
                        <div className="min-h-0 min-w-0 flex-1 shrink">
                            <MapKonva
                                floor={floor}
                                draggedIconRef={draggedIconRef}
                            />
                        </div>
                    </div>
                </div>
            </MapProvider>
        </>
    );
}

export default App;
