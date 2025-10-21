import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import type { Floor } from "@/types/MapTypes";
import useMap from "@/contexts/MapContext";
import { floors } from "@/config/mapsConfig";
import upperFirst from "lodash.upperfirst";
import { useEffect } from "react";

type FloorPickerProps = {
    floor: Floor;
    onFloorSelected: React.Dispatch<React.SetStateAction<Floor>>;
};

export default function FloorPicker(props: FloorPickerProps) {
    const { floor, onFloorSelected } = props;
    const { mapName } = useMap();

    const availableFloors = floors[mapName];

    useEffect(() => {
        if (availableFloors && !availableFloors?.includes(floor)) {
            onFloorSelected(availableFloors[0]);
        }
    }, [floor, availableFloors, onFloorSelected]);

    const handleFloorChange = (value: Floor) => {
        if (value) {
            onFloorSelected(value);
        }
    };

    return (
        <ToggleGroup
            value={floor}
            onValueChange={handleFloorChange}
            type="single"
            variant="outline"
        >
            {availableFloors?.map((floor) => {
                return (
                    <ToggleGroupItem value={floor} key={floor} className="px-5">
                        {upperFirst(floor)}
                    </ToggleGroupItem>
                );
            })}
        </ToggleGroup>
    );
}
