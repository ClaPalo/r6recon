import { MapContext } from "@/contexts/MapContext";
import { useContext } from "react";

export default function useMap() {
    const context = useContext(MapContext);
    if (context === null) {
        throw new Error("useMap must be used within a MapProvider");
    }
    return context;
}
