import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import type { Floor } from "@/types/index";
import useMap from "@/hooks/useMap";
import { floors } from "@/config/mapsConfig";
import upperFirst from "lodash.upperfirst";
import { useEffect } from "react";

export default function FloorPicker() {
    const { floor, setFloor } = useMap();
    const { mapName } = useMap();

    const availableFloors = floors[mapName];

    useEffect(() => {
        if (availableFloors && !availableFloors?.includes(floor)) {
            setFloor(availableFloors[0]);
        }
    }, [floor, availableFloors, setFloor]);

    const handleFloorChange = (value: Floor) => {
        if (value) {
            setFloor(value);
        }
    };

    return (
        <ToggleGroup
            value={floor}
            onValueChange={handleFloorChange}
            type="single"
            variant="default"
            className="gap-5"
        >
            {availableFloors?.map((floor) => {
                return (
                    <ToggleGroupItem
                        value={floor}
                        key={floor}
                        className="data-[state=on]:border-accent h-16 border-b-6 border-transparent px-5 pt-2 data-[state=on]:bg-transparent"
                    >
                        {upperFirst(floor)}
                    </ToggleGroupItem>
                );
            })}
        </ToggleGroup>
    );
}
