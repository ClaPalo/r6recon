import { Circle } from "@uiw/react-color";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Html } from "react-konva-utils";
import type { Vector2d } from "konva/lib/types";

interface IconColorPickerProps {
    isOpen: boolean;
    position: Vector2d;
    currentColor: string;
    onColorChange: (color: string) => void;
}

const BLUE_COLORS = ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"];
const RED_COLORS = ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"];

const COLOR_PICKER_STYLES = {
    gap: 1,
    borderRadius: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
} as const;

const RECT_PROPS_STYLE = {
    borderRadius: 1,
    height: 15,
} as const;

const POINT_PROPS_STYLE = {
    height: 10,
    borderRadius: 1,
    padding: 0,
} as const;

export const IconColorPicker = ({
    isOpen,
    position,
    currentColor,
    onColorChange,
}: IconColorPickerProps) => {
    return (
        <Html
            groupProps={{
                x: position.x,
                y: position.y,
            }}
        >
            <Popover open={isOpen}>
                <PopoverTrigger></PopoverTrigger>
                <PopoverContent className="flex h-16 max-h-56 w-35 flex-col items-start justify-start gap-3 rounded-none p-4 transition-all ease-in-out">
                    <div>
                        <Circle
                            color={currentColor}
                            colors={BLUE_COLORS}
                            style={COLOR_PICKER_STYLES}
                            onChange={(color) => onColorChange(color.hex)}
                            rectProps={{
                                style: {
                                    ...RECT_PROPS_STYLE,
                                    backgroundColor: currentColor,
                                },
                            }}
                            pointProps={{
                                style: POINT_PROPS_STYLE,
                            }}
                        />
                    </div>
                    <div>
                        <Circle
                            color={currentColor}
                            colors={RED_COLORS}
                            style={COLOR_PICKER_STYLES}
                            onChange={(color) => onColorChange(color.hex)}
                            rectProps={{
                                style: {
                                    ...RECT_PROPS_STYLE,
                                    backgroundColor: currentColor,
                                },
                            }}
                            pointProps={{
                                style: POINT_PROPS_STYLE,
                            }}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </Html>
    );
};
