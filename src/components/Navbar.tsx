import type { Floor } from "@/types/MapTypes";
import SelectMapDialog from "@/components/SelectMapDialog";
import FloorPicker from "@/components/FloorPicker";
import { Separator } from "./ui/separator";

type NavbarProps = {
    floor: Floor;
    onFloorSelected: React.Dispatch<React.SetStateAction<Floor>>;
};

export default function Navbar(props: NavbarProps) {
    const { floor, onFloorSelected } = props;
    return (
        <div className="flex h-16 w-full flex-row items-center gap-5 border-b-4 border-solid border-slate-800 pl-2">
            <SelectMapDialog />
            <div className="h-7">
                <Separator orientation="vertical" />
            </div>
            <FloorPicker floor={floor} onFloorSelected={onFloorSelected} />
        </div>
    );
}
