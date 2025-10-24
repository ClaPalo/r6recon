import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { MapName } from "@/types/index";
import { useState } from "react";
import useMap from "@/hooks/useMap";
import { floors } from "@/config/mapsConfig";

// TODO: Add component for each map
export default function SelectMapDialog() {
    const { setMapName } = useMap();
    const availableMaps: MapName[] = Object.keys(floors) as MapName[];
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Dialog open={isOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="cursor-pointer rounded-none border-2 p-5"
                    onClick={() => setIsOpen(true)}
                >
                    Choose Map
                </Button>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay
                    className="z-1100"
                    onClick={() => setIsOpen(false)}
                >
                    <DialogContent
                        className="z-1100 h-4/5 sm:max-w-10/12"
                        aria-describedby={undefined}
                    >
                        <DialogTitle className="hidden">
                            Available Maps
                        </DialogTitle>
                        <div className="grid grid-cols-4">
                            {availableMaps.map((mapName: MapName) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setMapName(mapName);
                                            setIsOpen(false);
                                        }}
                                        key={mapName}
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
