import { useRef, useEffect, useCallback } from "react";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Vector2d } from "konva/lib/types";
import {
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    BOUNCE_DURATION,
    toAbsolute,
    toRelative,
    calculateBoundedPosition,
} from "./utils";

interface UseStageControlsProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    stageRef: React.RefObject<Konva.Stage | null>;
    groupRef: React.RefObject<Konva.Group | null>;
    baseMapRef: React.RefObject<Konva.Image | null>;
    onPanOrZoom?: () => void;
}

export const useStageControls = ({
    containerRef,
    stageRef,
    groupRef,
    baseMapRef,
    onPanOrZoom,
}: UseStageControlsProps) => {
    const sceneWidthRef = useRef(IMAGE_WIDTH);
    const sceneHeightRef = useRef(IMAGE_HEIGHT);

    /**
     * Reset stage size and scale to fill the parent container
     */
    const resetStageSize = useCallback(() => {
        const container = containerRef.current;
        const stage = stageRef.current;
        if (!container || !stage) return;

        const sceneWidth = sceneWidthRef.current;
        const sceneHeight = sceneHeightRef.current;

        // Get container width
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Calculate scale
        const scaleWidth = containerWidth / sceneWidth;
        const scaleHeight = containerHeight / sceneHeight;

        // Update state with new dimensions
        stage.width(sceneWidth * scaleWidth);
        stage.height(sceneHeight * scaleHeight);
        stage.scale({ x: scaleWidth, y: scaleWidth });
    }, [containerRef, stageRef]);

    useEffect(() => {
        resetStageSize();
        window.addEventListener("resize", resetStageSize);

        return () => {
            window.removeEventListener("resize", resetStageSize);
        };
    }, [resetStageSize]);

    /**
     * Reset stage size and scale, and move the group containing the background image to the origin
     */
    const restoreDefaultPositionAndScale = () => {
        const group = groupRef.current;
        const stage = stageRef.current;
        if (!group || !stage) return;

        onPanOrZoom?.();

        resetStageSize();
        group.position({ x: 0, y: 0 });
    };

    /**
     * Calculates the boundary-constrained position given the dragging target
     * @param pos Absolute coordinates of the target position
     * @returns Boundary-constrained position
     */
    const handleDragBoundFunc = (pos: Vector2d) => {
        const stage = stageRef.current;
        const image = baseMapRef.current;
        if (!stage || !image) return pos;

        return calculateBoundedPosition(pos, stage, image);
    };

    /**
     * Moves the Konva Node to the target position.
     * If the target position is outside of the boundaries, it bounces the node back to a valid position.
     * @param node Konva Node that is changing position
     * @param tentativeRelativePosition Target position
     */
    const moveToRelativePosition = (
        node: Konva.Node,
        tentativeRelativePosition: Vector2d,
    ) => {
        const stage = stageRef.current;
        if (!stage) return;

        // Move the node to the tentative position
        node.position(tentativeRelativePosition);

        // Check if it was a valid position
        const newAbsolutePosition = handleDragBoundFunc(
            toAbsolute(tentativeRelativePosition, stage),
        );

        if (
            JSON.stringify(toRelative(newAbsolutePosition, stage)) !==
            JSON.stringify(tentativeRelativePosition)
        ) {
            bounceBackTo(node, toRelative(newAbsolutePosition, stage));
        }
    };

    /**
     * Moves a Konva Node to the target position through a smooth transition
     * @param node Konva Node to be moved
     * @param pos Target position
     */
    const bounceBackTo = (node: Konva.Node, pos: Vector2d) => {
        node.to({
            x: pos.x,
            y: pos.y,
            duration: BOUNCE_DURATION,
        });
    };

    const handleWheelPan = (
        e: KonvaEventObject<WheelEvent>,
        axis: "x" | "y",
        delta: number,
    ) => {
        const moveBy = 7.5;
        const group = groupRef.current;
        const stage = stageRef.current;
        if (!group || !stage) return;

        let moveX = axis === "x" ? true : false;
        if (e.evt.altKey) {
            moveX = !moveX;
        }
        let direction = delta > 0 ? -1 : 1;
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const shiftX = Number(moveX) * direction * moveBy;
        const shiftY = Number(!moveX) * direction * moveBy;

        const pos = {
            x: group.position().x + shiftX,
            y: group.position().y + shiftY,
        };

        moveToRelativePosition(group, pos);
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        onPanOrZoom?.();

        const stage = stageRef.current;
        const group = groupRef.current;
        if (!stage || !group) return;

        if (e.evt.deltaX) {
            // Horizontal wheel -> pan
            handleWheelPan(e, "x", e.evt.deltaX);
        } else {
            // Vertical wheel
            if (e.evt.metaKey) {
                handleWheelPan(e, "y", e.evt.deltaY);
                return;
            }
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            if (!pointer) return;

            const mousePointTo = {
                x: pointer.x / oldScale - group.x(),
                y: pointer.y / oldScale - group.y(),
            };

            let direction = e.evt.deltaY > 0 ? -1 : 1;

            if (e.evt.ctrlKey || e.evt.altKey) {
                direction = -direction;
            }

            const scaleBy = 1.05;
            const newScale =
                direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            stage.scale({ x: newScale, y: newScale });
            const newPos = {
                x: pointer.x / newScale - mousePointTo.x,
                y: pointer.y / newScale - mousePointTo.y,
            };

            const newAbsolutePosition = handleDragBoundFunc(
                toAbsolute(newPos, stage),
            );

            group.position(toRelative(newAbsolutePosition, stage));
        }
    };

    const handleBackgroundDragEnd = (
        e: KonvaEventObject<globalThis.DragEvent>,
    ) => {
        const element = e.target;

        // Only handle drag end if the target is the Group itself (not child elements)
        if (element !== groupRef.current) {
            return;
        }

        const pos = {
            x: e.target.x(),
            y: e.target.y(),
        };

        moveToRelativePosition(element, pos);
    };

    return {
        handleWheel,
        handleBackgroundDragEnd,
        restoreDefaultPositionAndScale,
    };
};
