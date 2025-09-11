import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import type { Floor } from "@/types/MapTypes";

type FloorPickerProps = {
    onFloorSelected: React.Dispatch<React.SetStateAction<Floor>>;
};

export default function FloorPicker(props: FloorPickerProps) {
    const { onFloorSelected } = props;
    const [selectedFloor, setSelectedFloor] = useState<Floor>("first");

    const handleFloorChange = (value: Floor) => {
        setSelectedFloor(value);
        onFloorSelected(value);
    };

    return (
        <ToggleGroup
            value={selectedFloor}
            onValueChange={handleFloorChange}
            type="single"
            variant="outline"
        >
            <ToggleGroupItem value="basement" className="px-5">
                Basement
            </ToggleGroupItem>
            <ToggleGroupItem value="first" className="px-5">
                First
            </ToggleGroupItem>
            <ToggleGroupItem value="second" className="px-5">
                Second
            </ToggleGroupItem>
            <ToggleGroupItem value="roof" className="px-5">
                Roof
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
