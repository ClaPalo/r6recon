import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { MapName } from "@/types/MapTypes";
import { useState } from "react";

type SelectMapDialogProps = {
    onMapSelected: React.Dispatch<React.SetStateAction<MapName>>;
};

// TODO: Move to JSON
const maps: MapName[] = [
    "bank",
    "border",
    "chalet",
    "clubhouse",
    "coastline",
    "consulate",
    "emeraldplains",
    "favela",
    "fortress",
    "herefordbase",
    "house",
    "kafe",
    "kanal",
    "lair",
    "nighthavenlabs",
    "oregon",
    "outback",
    "presidentialplane",
    "skyscraper",
    "stadiumbravo",
    "stadium2020",
    "themepark",
    "tower",
    "villa",
    "yacht",
];

// TODO: Add component for each map
export default function SelectMapDialog(props: SelectMapDialogProps) {
    const { onMapSelected } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Dialog open={isOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsOpen(true)}>
                    Choose Map
                </Button>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay
                    className="z-1100"
                    onClick={() => setIsOpen(false)}
                >
                    <DialogContent className="z-1100 h-4/5 sm:max-w-10/12">
                        <div className="grid grid-cols-4">
                            {maps.map((mapName: MapName) => {
                                return (
                                    <div
                                        onClick={() => {
                                            onMapSelected(mapName);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {mapName}
                                    </div>
                                );
                            })}
                        </div>
                    </DialogContent>
                </DialogOverlay>
            </DialogPortal>
        </Dialog>
    );
}
