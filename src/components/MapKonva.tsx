import useMap from "@/contexts/MapContext";
import type { Floor } from "@/types/MapTypes";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage as StageType } from "konva/lib/Stage";
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Image, Layer, Stage } from "react-konva";
import useImage from "use-image";

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

    const sceneWidthRef = useRef(window.innerWidth - 0.1 * window.innerWidth);
    const sceneHeightRef = useRef(
        window.innerHeight - 0.1 * window.innerHeight,
    );

    // State to track current scale and dimensions
    const [stageSize, setStageSize] = useState({
        width: sceneWidthRef.current,
        height: sceneHeightRef.current,
        scale: 1,
    });

    useEffect(() => {
        updateSize();
        window.addEventListener("resize", updateSize);

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    const updateSize = () => {
        if (!containerRef.current) return;

        const sceneWidth = sceneWidthRef.current;
        const sceneHeight = sceneHeightRef.current;

        // Get container width
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        // Calculate scale
        const scaleWidth = containerWidth / sceneWidth;
        const scaleHeight = containerHeight / sceneHeight;

        // Update state with new dimensions
        setStageSize({
            width: sceneWidth * scaleWidth,
            height: sceneHeight * scaleHeight,
            scale: scaleWidth,
        });
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
        <div ref={containerRef} className="h-full w-full">
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                scaleX={stageSize.scale}
                scaleY={stageSize.scale}
                ref={stageRef}
                onWheel={handleWheel}
            >
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
