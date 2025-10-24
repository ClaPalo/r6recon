import type { Floor, MapName } from "@/types/index";
import { createContext, type Dispatch, type SetStateAction } from "react";

type ContextType = {
    mapName: MapName;
    setMapName: Dispatch<SetStateAction<MapName>>;
    floor: Floor;
    setFloor: Dispatch<SetStateAction<Floor>>;
};

export const MapContext = createContext<ContextType | null>(null);
