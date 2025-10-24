import "@/App.css";
import { useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MapKonva from "./components/MapKonva";
import MapProvider from "./providers/MapProvider";
import type { Icon } from "./types/index";

function App() {
    const draggedIconRef = useRef<Icon>("bomb");

    const handleIconDragStart = (icon: Icon) => {
        draggedIconRef.current = icon;
    };

    return (
        <>
            <MapProvider>
                <div className="flex h-screen w-screen flex-col">
                    <Navbar />
                    <div className="flex w-screen flex-1 flex-row">
                        <div className="h-full">
                            <Sidebar handleDragStart={handleIconDragStart} />
                        </div>
                        <div className="min-h-0 min-w-0 flex-1 shrink">
                            <MapKonva draggedIconRef={draggedIconRef} />
                        </div>
                    </div>
                </div>
            </MapProvider>
        </>
    );
}

export default App;
