import type { MapName } from "@/types/MapTypes";
import { useState } from "react";
import { MapContext } from "@/contexts/MapContext";

function MapProvider(props: { children: React.ReactNode }) {
    const [mapName, setMapName] = useState<MapName>("chalet");
    const { children } = props;
    return (
        <MapContext.Provider value={{ mapName, setMapName }}>
            {children}
        </MapContext.Provider>
    );
}

export default MapProvider;
