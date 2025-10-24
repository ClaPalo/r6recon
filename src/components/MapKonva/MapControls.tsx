import { RxCorners } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface MapControlsProps {
    onRestore: () => void;
    onClearAll: () => void;
}

export const MapControls = ({ onRestore, onClearAll }: MapControlsProps) => {
    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="bg-secondary absolute top-3 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2">
                        <RxCorners
                            className="h-full w-full p-2"
                            onClick={onRestore}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Resize</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="bg-secondary absolute top-16 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2">
                        <RiDeleteBin6Line
                            className="h-full w-full p-2"
                            onClick={onClearAll}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Remove all icons</p>
                </TooltipContent>
            </Tooltip>
        </>
    );
};
