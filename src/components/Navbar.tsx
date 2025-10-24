import type { Floor } from "@/types/MapTypes";
import SelectMapDialog from "@/components/SelectMapDialog";
import FloorPicker from "@/components/FloorPicker";

type NavbarProps = {
    floor: Floor;
    onFloorSelected: React.Dispatch<React.SetStateAction<Floor>>;
};

export default function Navbar(props: NavbarProps) {
    const { floor, onFloorSelected } = props;
    return (
        <div className="t-0 l-0 z-9999 flex h-12 w-full flex-row items-center gap-5 border-b-1 border-solid border-slate-800">
            <div className="px-2">
                <SelectMapDialog />
            </div>
            <FloorPicker floor={floor} onFloorSelected={onFloorSelected} />
        </div>
    );
}
