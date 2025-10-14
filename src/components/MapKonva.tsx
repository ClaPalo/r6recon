import type { Floor, MapName } from "@/types/MapTypes";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage as StageType } from "konva/lib/Stage";
import { useRef } from "react";
import { Circle, Group, Image, Layer, Stage } from "react-konva";
import useImage from "use-image";

type MapProps = {
    mapName: MapName;
    floor: Floor;
};

export default function MapKonva(props: MapProps) {
    const { mapName, floor } = props;
    const [map] = useImage(`/${mapName}/${floor}.jpg`);
    const stageRef = useRef<Konva.Stage>(null);

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
        <Stage
            className="h-full w-full grow-0"
            width={window.innerWidth - 80}
            height={window.innerHeight}
            ref={stageRef}
            onWheel={handleWheel}
        >
            <Layer>
                <Group draggable>
                    <Image width={1600} height={900} image={map} />
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
    );
}
