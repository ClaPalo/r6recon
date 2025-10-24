import { useState, type DragEvent, type RefObject } from "react";
import type Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import type { Icon } from "@/types/IconTypes";
import { isPositionOnIcon } from "./utils";

export interface DrawnIcon {
    x: number;
    y: number;
    src: Icon;
    color: string;
}

interface UseIconManagementProps {
    groupRef: RefObject<Konva.Group | null>;
    stageRef: RefObject<Konva.Stage | null>;
    draggedIconRef: RefObject<string>;
}

export const useIconManagement = ({
    groupRef,
    stageRef,
    draggedIconRef,
}: UseIconManagementProps) => {
    const [iconsToDraw, setIconsToDraw] = useState<DrawnIcon[]>([]);
    const [cursorStyle, setCursorStyle] = useState<"auto" | "pointer">("auto");

    const handleIconDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const group = groupRef.current;
        const stage = stageRef.current;
        if (!group || !stage) return;

        stage.setPointersPositions(e);
        setIconsToDraw(
            iconsToDraw.concat([
                {
                    ...group.getRelativePointerPosition()!,
                    src: draggedIconRef.current as Icon,
                    color: "#fffff",
                },
            ]),
        );
    };

    const findIconAtPosition = (pos: Vector2d): number => {
        return iconsToDraw.findIndex((icon) => {
            return isPositionOnIcon(pos, icon);
        });
    };

    const handleMouseMove = () => {
        const group = groupRef.current;
        if (!group) return;

        const mousePosition = group.getRelativePointerPosition()!;
        const iconIndex = findIconAtPosition(mousePosition);

        setCursorStyle(iconIndex !== -1 ? "pointer" : "auto");
    };

    const updateIconPosition = (index: number, newPos: Vector2d) => {
        setIconsToDraw((prev) =>
            prev.map((prevIcon, prevIndex) =>
                prevIndex === index
                    ? {
                          ...prevIcon,
                          x: newPos.x,
                          y: newPos.y,
                      }
                    : prevIcon,
            ),
        );
    };

    const updateIconColor = (index: number, color: string) => {
        setIconsToDraw((prev) =>
            prev.map((prevIcon, prevIndex) =>
                prevIndex === index
                    ? {
                          ...prevIcon,
                          color: color,
                      }
                    : prevIcon,
            ),
        );
    };

    const clearAllIcons = () => {
        setIconsToDraw([]);
    };

    return {
        iconsToDraw,
        cursorStyle,
        handleIconDrop,
        findIconAtPosition,
        handleMouseMove,
        updateIconPosition,
        updateIconColor,
        clearAllIcons,
    };
};
