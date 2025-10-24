import SelectMapDialog from "@/components/SelectMapDialog";
import FloorPicker from "@/components/FloorPicker";
import { Separator } from "./ui/separator";

export default function Navbar() {
    return (
        <div className="flex h-15 w-full flex-row items-center gap-5 border-b-4 border-solid border-slate-800 pl-2">
            <SelectMapDialog />
            <div className="h-7">
                <Separator orientation="vertical" />
            </div>
            <FloorPicker />
        </div>
    );
}
