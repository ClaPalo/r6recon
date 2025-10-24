import type { Vector2d } from "konva/lib/types";
import type Konva from "konva";

export const IMAGE_WIDTH = 3840;
export const IMAGE_HEIGHT = 2160;
export const BOUNCE_DURATION = 0.2;
export const BOUNDARY_PERCENTAGE = 0.2; // Percentage of the map that should always be visible on the screen

/**
 * Converts relative position to absolute position based on stage scale
 */
export const toAbsolute = (
    relativePosition: Vector2d,
    stage: Konva.Stage | null,
): Vector2d => {
    if (!stage) return { x: 0, y: 0 };

    return {
        x: relativePosition.x * stage.scaleX(),
        y: relativePosition.y * stage.scaleY(),
    };
};

/**
 * Converts absolute position to relative position based on stage scale
 */
export const toRelative = (
    absolutePosition: Vector2d,
    stage: Konva.Stage | null,
): Vector2d => {
    if (!stage) return { x: 0, y: 0 };

    return {
        x: absolutePosition.x / stage.scaleX(),
        y: absolutePosition.y / stage.scaleY(),
    };
};

/**
 * Calculates the boundary-constrained position for dragging
 */
export const calculateBoundedPosition = (
    pos: Vector2d,
    stage: Konva.Stage,
    image: Konva.Image,
): Vector2d => {
    const minX = BOUNDARY_PERCENTAGE * stage.width();
    const minY = BOUNDARY_PERCENTAGE * stage.height();
    const maxX = (1 - BOUNDARY_PERCENTAGE) * stage.width();
    const maxY = (1 - BOUNDARY_PERCENTAGE) * stage.height();

    const newX =
        Math.max(minX, Math.min(pos.x, maxX) + image.width() * stage.scaleX()) -
        image.width() * stage.scaleX();
    const newY =
        Math.max(
            minY,
            Math.min(pos.y, maxY) + image.height() * stage.scaleY(),
        ) -
        image.height() * stage.scaleY();

    return { x: newX, y: newY };
};

/**
 * Checks if a position is within an icon's bounds
 */
export const isPositionOnIcon = (
    pos: Vector2d,
    icon: { x: number; y: number },
    hitboxSize = 50,
): boolean => {
    return (
        pos.x >= icon.x - hitboxSize &&
        pos.x <= icon.x + hitboxSize &&
        pos.y >= icon.y - hitboxSize &&
        pos.y <= icon.y + hitboxSize
    );
};
