import useMap from "@/contexts/MapContext";
import type { Floor } from "@/types/MapTypes";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage as StageType } from "konva/lib/Stage";
import { useEffect, useRef } from "react";
import { Circle, Group, Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { RxCorners } from "react-icons/rx";

type MapProps = {
    floor: Floor;
};

export default function MapKonva(props: MapProps) {
    const { floor } = props;
    const { mapName } = useMap();
    const [map] = useImage(`/${mapName}/${floor}.jpg`);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const imageRef = useRef<Konva.Image>(null);
    const groupRef = useRef<Konva.Group>(null);

    const sceneWidthRef = useRef(1600);
    const sceneHeightRef = useRef(900);

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
        stage.position({ x: 0, y: 0 });
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

        console.log(containerWidth);

        // Update state with new dimensions
        stage.width(sceneWidth * scaleWidth);
        stage.height(sceneHeight * scaleHeight);
        stage.scale({ x: scaleWidth, y: scaleWidth });
    };

    const handlePan = (
        e: KonvaEventObject<WheelEvent>,
        stage: StageType,
        axis: "x" | "y",
        delta: number,
    ) => {
        const moveBy = 7.5;
        let moveX = axis == "x" ? true : false;
        if (e.evt.altKey) {
            moveX = !moveX;
        }
        let direction = delta > 0 ? -1 : 1;
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        stage.move({
            x: Number(moveX) * direction * moveBy,
            y: Number(!moveX) * direction * moveBy,
        });
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;

        if (e.evt.deltaX) {
            // Horizontal wheel -> pan
            handlePan(e, stage, "x", e.evt.deltaX);
        } else {
            // Vertical wheel
            if (e.evt.metaKey) {
                handlePan(e, stage, "y", e.evt.deltaY);
                return;
            }

            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            if (!pointer) return;

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
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
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
        }
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
                    <Group ref={groupRef} draggable>
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
