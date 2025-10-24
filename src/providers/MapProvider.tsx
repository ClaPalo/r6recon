import type { Floor, MapName } from "@/types/index";
import { useState } from "react";
import { MapContext } from "@/contexts/MapContext";

function MapProvider(props: { children: React.ReactNode }) {
    const [mapName, setMapName] = useState<MapName>("chalet");
    const [floor, setFloor] = useState<Floor>("basement");

    const { children } = props;
    return (
        <MapContext.Provider value={{ mapName, setMapName, floor, setFloor }}>
            {children}
        </MapContext.Provider>
    );
}

export default MapProvider;
