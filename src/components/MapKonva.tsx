import useMap from "@/contexts/MapContext";
import type { Floor } from "@/types/MapTypes";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef } from "react";
import { Circle, Group, Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { RxCorners } from "react-icons/rx";

type MapProps = {
    floor: Floor;
};

const IMAGE_WIDTH = 3840;
const IMAGE_HEIGHT = 2160;
const MIN_SCALE = 0.3;
const MAX_SCALE = 10;
const BOUNCE_DURATION = 0.2;
const BOUNDARY_PERCENTAGE = 0.1; // Percentage of the map that should always be visible on the screen

export default function MapKonva(props: MapProps) {
    const { floor } = props;
    const { mapName } = useMap();
    const [map] = useImage(`/${mapName}/${floor}.png`);
    const [baseMap] = useImage(`/${mapName}/base.png`);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const imageRef = useRef<Konva.Image>(null);
    const groupRef = useRef<Konva.Group>(null);

    const sceneWidthRef = useRef(IMAGE_WIDTH);
    const sceneHeightRef = useRef(IMAGE_HEIGHT);

    useEffect(() => {
        resetStageSize();
        window.addEventListener("resize", resetStageSize);

        return () => {
            window.removeEventListener("resize", resetStageSize);
        };
    }, []);

    const restoreDefaultPositionAndScale = () => {
        const group = groupRef.current;
        const stage = stageRef.current;
        if (!group || !stage) return;

        resetStageSize();
        group.position({ x: 0, y: 0 });
    };

    const resetStageSize = () => {
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
    };

    const handlePan = (
        e: KonvaEventObject<WheelEvent>,
        axis: "x" | "y",
        delta: number,
    ) => {
        const moveBy = 7.5;
        const group = groupRef.current;
        const stage = stageRef.current;
        if (!group || !stage) return;

        let moveX = axis == "x" ? true : false;
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

        // Move the group to the tentative position
        moveToRelativePosition(group, pos);
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        const group = groupRef.current;
        if (!stage || !group) return;

        if (e.evt.deltaX) {
            // Horizontal wheel -> pan
            handlePan(e, "x", e.evt.deltaX);
        } else {
            // Vertical wheel
            if (e.evt.metaKey) {
                handlePan(e, "y", e.evt.deltaY);
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

            if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
                stage.scale({ x: newScale, y: newScale });
                const newPos = {
                    x: pointer.x / newScale - mousePointTo.x,
                    y: pointer.y / newScale - mousePointTo.y,
                };

                const newAbsolutePosition = handleDragBoundFunc(
                    toAbsolute(newPos),
                );

                group.position(toRelative(newAbsolutePosition));
            }
        }
    };

    const toRelative = (absolutePosition: { x: number; y: number }) => {
        const stage = stageRef.current;
        if (!stage) return { x: 0, y: 0 };

        return {
            x: absolutePosition.x / stage.scaleX(),
            y: absolutePosition.y / stage.scaleY(),
        };
    };

    const toAbsolute = (relativePosition: { x: number; y: number }) => {
        const stage = stageRef.current;
        if (!stage) return { x: 0, y: 0 };

        return {
            x: relativePosition.x * stage.scaleX(),
            y: relativePosition.y * stage.scaleY(),
        };
    };

    const handleDragBoundFunc = (pos: { x: number; y: number }) => {
        const group = groupRef.current;
        const stage = stageRef.current;
        const image = imageRef.current;
        if (!group || !stage || !image) return pos;

        const minX = BOUNDARY_PERCENTAGE * stage.width();
        const minY = BOUNDARY_PERCENTAGE * stage.height();
        const maxX = (1 - BOUNDARY_PERCENTAGE) * stage.width();
        const maxY = (1 - BOUNDARY_PERCENTAGE) * stage.height();

        const newX =
            Math.max(
                minX,
                Math.min(pos.x, maxX) + image.width() * stage.scaleX(),
            ) -
            image.width() * stage.scaleX();
        const newY =
            Math.max(
                minY,
                Math.min(pos.y, maxY) + image.height() * stage.scaleY(),
            ) -
            image.height() * stage.scaleY();
        return { x: newX, y: newY };
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent, Konva.Node>) => {
        const element = e.target;

        const pos = {
            x: e.target.x(),
            y: e.target.y(),
        };

        moveToRelativePosition(element, pos);
    };

    const moveToRelativePosition = (
        node: Konva.Node,
        tentativeRelativePosition: { x: number; y: number },
    ) => {
        // Move the group to the tentative position
        node.position(tentativeRelativePosition);

        // Check if it was a valid position
        const newAbsolutePosition = handleDragBoundFunc(
            toAbsolute(tentativeRelativePosition),
        );

        if (toRelative(newAbsolutePosition) != tentativeRelativePosition) {
            bounceBackTo(node, toRelative(newAbsolutePosition));
        }
    };

    const bounceBackTo = (node: Konva.Node, pos: { x: number; y: number }) => {
        node.to({
            x: pos.x,
            y: pos.y,
            duration: BOUNCE_DURATION,
        });
    };

    return (
        <div ref={containerRef} className="relative h-full">
            <div className="absolute top-3 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 bg-[#0f172a]">
                <RxCorners
                    className="h-full w-full p-2"
                    onClick={restoreDefaultPositionAndScale}
                />
            </div>
            <Stage ref={stageRef} onWheel={handleWheel}>
                <Layer>
                    <Group
                        ref={groupRef}
                        draggable
                        onDragEnd={(e) => handleDragEnd(e)}
                    >
                        <Image image={baseMap} ref={imageRef} />
                        <Image image={map} />
                        <Circle
                            x={200}
                            y={100}
                            radius={50}
                            fill="green"
                            draggable
                        />
                    </Group>
                </Layer>
            </Stage>
        </div>
    );
}
