import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import type { Floor } from "@/types/MapTypes";
import useMap from "@/contexts/MapContext";
import { floors } from "@/config/mapsConfig";
import upperFirst from "lodash.upperfirst";

type FloorPickerProps = {
    onFloorSelected: React.Dispatch<React.SetStateAction<Floor>>;
};

export default function FloorPicker(props: FloorPickerProps) {
    const { onFloorSelected } = props;
    const { mapName } = useMap();

    const availableFloors = floors[mapName];

    const [selectedFloor, setSelectedFloor] = useState<Floor>("first");

    const handleFloorChange = (value: Floor) => {
        if (value) {
            setSelectedFloor(value);
            onFloorSelected(value);
        }
    };

    return (
        <ToggleGroup
            value={selectedFloor}
            onValueChange={handleFloorChange}
            type="single"
            variant="outline"
        >
            {availableFloors?.map((floor) => {
                return (
                    <ToggleGroupItem value={floor} className="px-5">
                        {upperFirst(floor)}
                    </ToggleGroupItem>
                );
            })}
        </ToggleGroup>
    );
}
