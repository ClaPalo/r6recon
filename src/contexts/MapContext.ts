import type { MapName } from "@/types/MapTypes";
import {
    createContext,
    useContext,
    type Dispatch,
    type SetStateAction,
} from "react";

type ContextType = {
    mapName: MapName;
    setMapName: Dispatch<SetStateAction<MapName>>;
};

export const MapContext = createContext<ContextType | null>(null);

export default function useMap() {
    const context = useContext(MapContext);
    if (context === null) {
        throw new Error("useMap must be used within a MapProvider");
    }
    return context;
}
