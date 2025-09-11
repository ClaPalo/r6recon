import type { MapName, Floor } from "@/types/MapTypes";
import SelectMapDialog from "./SelectMapDialog";
import FloorPicker from "./FloorPicker";

type NavbarProps = {
    onMapSelected: React.Dispatch<React.SetStateAction<MapName>>;
    onFloorSelected: React.Dispatch<React.SetStateAction<Floor>>;
};

export default function Navbar(props: NavbarProps) {
    const { onMapSelected, onFloorSelected } = props;
    return (
        <div className="t-0 l-0 fixed z-9999 flex h-12 w-full flex-row items-center gap-5 border-b-1 border-solid border-slate-800">
            <div className="px-2">
                <SelectMapDialog onMapSelected={onMapSelected} />
            </div>
            <FloorPicker onFloorSelected={onFloorSelected} />
        </div>
    );
}
