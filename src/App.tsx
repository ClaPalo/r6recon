import Map from "@/components/MapLeaflet";
import "@/App.css";
import { useState } from "react";
import { type MapName, type Floor } from "@/types/MapTypes";
import SelectMapDialog from "./components/SelectMapDialog";

function App() {
    const [mapName, setMapName] = useState<MapName>("chalet");
    const [floor] = useState<Floor>("basement");

    return (
        <>
            <SelectMapDialog onMapSelected={setMapName} />
            <Map mapName={mapName} floor={floor} />
        </>
    );
}

export default App;
