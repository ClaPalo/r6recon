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

const IMAGE_WIDTH = 1600;
const IMAGE_HEIGHT = 900;
const MIN_SCALE = 0.3;
const MAX_SCALE = 10;

export default function MapKonva(props: MapProps) {
    const { floor } = props;
    const { mapName } = useMap();
    const [map] = useImage(`/${mapName}/${floor}.jpg`);
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

        const tentativeRelativePosition = {
            x: group.position().x + shiftX,
            y: group.position().y + shiftY,
        };

        const newAbsolutePosition = handleDragBoundFunc({
            x: tentativeRelativePosition.x * stage.scaleX(),
            y: tentativeRelativePosition.y * stage.scaleY(),
        });

        group.position({
            x: newAbsolutePosition.x / stage.scaleX(),
            y: newAbsolutePosition.y / stage.scaleY(),
        });
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
                group.position(newPos);
            }
        }
    };

    const handleDragBoundFunc = (pos: { x: number; y: number }) => {
        const group = groupRef.current;
        const stage = stageRef.current;
        const image = imageRef.current;
        if (!group || !stage || !image) return pos;

        const minX = 0.1 * stage.width();
        const minY = 0.1 * stage.height();
        const maxX = 0.9 * stage.width();
        const maxY = 0.9 * stage.height();

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
                        dragBoundFunc={handleDragBoundFunc}
                    >
                        <Image image={map} ref={imageRef} />
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
