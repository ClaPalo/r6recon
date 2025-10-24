import { useState, useEffect } from "react";
import type { Vector2d } from "konva/lib/types";

interface PopoverState {
    position: Vector2d;
    isOpen: boolean;
    isExpanded: boolean;
    iconIndex: number;
}

export const usePopoverState = (iconCount: number) => {
    const [popover, setPopover] = useState<PopoverState>({
        position: { x: 0, y: 0 },
        isOpen: false,
        isExpanded: false,
        iconIndex: 0,
    });

    // Close popover any time an icon is modified
    useEffect(() => {
        closePopover();
    }, [iconCount]);

    const closePopover = () => {
        setPopover((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };

    const openPopover = (position: Vector2d, iconIndex: number) => {
        setPopover((prev) => ({
            ...prev,
            position,
            isOpen: true,
            iconIndex,
        }));
    };

    return {
        popover,
        closePopover,
        openPopover,
    };
};
