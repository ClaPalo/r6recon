import useMap from "@/contexts/MapContext";
import type { Floor } from "@/types/MapTypes";
import type Konva from "konva";
import { useRef, type RefObject } from "react";
import { Group, Image, Layer, Path, Stage } from "react-konva";
import useImage from "use-image";
import { icons } from "@/lib/icons";
import { useStageControls } from "./MapKonva/useStageControls";
import { useIconManagement } from "./MapKonva/useIconManagement";
import { usePopoverState } from "./MapKonva/usePopoverState";
import { MapControls } from "./MapKonva/MapControls";
import { IconColorPicker } from "./MapKonva/IconColorPicker";

type MapProps = {
    floor: Floor;
    draggedIconRef: RefObject<string>;
};

export default function MapKonva(props: MapProps) {
    const { floor, draggedIconRef } = props;
    const { mapName } = useMap();
    const [map] = useImage(`/${mapName}/${floor}.png`);
    const [baseMap] = useImage(`/${mapName}/base.png`);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const baseMapRef = useRef<Konva.Image>(null);
    const groupRef = useRef<Konva.Group>(null);

    const {
        iconsToDraw,
        cursorStyle,
        handleIconDrop,
        findIconAtPosition,
        handleMouseMove,
        updateIconPosition,
        updateIconColor,
        clearAllIcons,
    } = useIconManagement({
        groupRef: groupRef as RefObject<Konva.Group | null>,
        stageRef: stageRef as RefObject<Konva.Stage | null>,
        draggedIconRef,
    });

    const { popover, closePopover, openPopover } = usePopoverState(
        iconsToDraw.length,
    );

    const {
        handleWheel,
        handleBackgroundDragEnd,
        restoreDefaultPositionAndScale,
    } = useStageControls({
        containerRef: containerRef as RefObject<HTMLDivElement | null>,
        stageRef: stageRef as RefObject<Konva.Stage | null>,
        groupRef: groupRef as RefObject<Konva.Group | null>,
        baseMapRef: baseMapRef as RefObject<Konva.Image | null>,
        onPanOrZoom: closePopover,
    });

    const handleStageClick = () => {
        if (popover.isOpen) {
            closePopover();
            return;
        }

        const group = groupRef.current;
        if (!group) return;

        const mousePosition = group.getRelativePointerPosition()!;
        const iconIndex = findIconAtPosition(mousePosition);

        if (iconIndex !== -1) {
            openPopover(mousePosition, iconIndex);
        } else {
            closePopover();
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative h-full"
            onDrop={(e) => handleIconDrop(e)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            style={{
                cursor: cursorStyle,
            }}
        >
            <MapControls
                onRestore={restoreDefaultPositionAndScale}
                onClearAll={clearAllIcons}
            />
            <Stage
                ref={stageRef}
                onWheel={handleWheel}
                onMouseMove={handleMouseMove}
                onClick={handleStageClick}
            >
                <Layer>
                    <Group
                        ref={groupRef}
                        draggable
                        onDragEnd={(e) => handleBackgroundDragEnd(e)}
                        onDragMove={() => closePopover()}
                    >
                        <Image image={baseMap} ref={baseMapRef} />
                        <Image image={map} />
                        <Group>
                            {iconsToDraw.map((icon, index) => {
                                return (
                                    <Path
                                        key={`${icon.x}-${icon.y}-${index}`}
                                        draggable
                                        x={icon.x}
                                        y={icon.y}
                                        offsetX={250}
                                        offsetY={250}
                                        scale={{ x: 0.2, y: 0.2 }}
                                        data={icons[icon.src]}
                                        fill={icon.color}
                                        onDragEnd={(e) => {
                                            const newPos = e.target.position();
                                            updateIconPosition(index, newPos);
                                        }}
                                        onDragMove={() => closePopover()}
                                    />
                                );
                            })}
                            <IconColorPicker
                                isOpen={popover.isOpen}
                                position={popover.position}
                                currentColor={
                                    iconsToDraw[popover.iconIndex]?.color ||
                                    "#fffff"
                                }
                                onColorChange={(color) =>
                                    updateIconColor(popover.iconIndex, color)
                                }
                            />
                        </Group>
                    </Group>
                </Layer>
            </Stage>
        </div>
    );
}
