import useMap from "@/contexts/MapContext";
import type { Floor } from "@/types/MapTypes";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import {
    useEffect,
    useRef,
    useState,
    type DragEvent,
    type RefObject,
} from "react";
import { Group, Image, Layer, Path, Stage } from "react-konva";
import useImage from "use-image";
import { RxCorners } from "react-icons/rx";
import { icons } from "@/lib/icons";
import type { Icon } from "@/types/IconTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Html } from "react-konva-utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { Vector2d } from "konva/lib/types";

type MapProps = {
    floor: Floor;
    draggedIconRef: RefObject<string>;
};

const IMAGE_WIDTH = 3840;
const IMAGE_HEIGHT = 2160;
const BOUNCE_DURATION = 0.2;
const BOUNDARY_PERCENTAGE = 0.2; // Percentage of the map that should always be visible on the screen

export default function MapKonva(props: MapProps) {
    const { floor, draggedIconRef } = props;
    const { mapName } = useMap();
    const [map] = useImage(`/${mapName}/${floor}.png`);
    const [baseMap] = useImage(`/${mapName}/base.png`);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const baseMapRef = useRef<Konva.Image>(null);
    const groupRef = useRef<Konva.Group>(null);
    const [iconsToDraw, setIconsToDraw] = useState<
        { x: number; y: number; src: Icon }[]
    >([]);
    const [isIconMenuActive, setIsIconMenuActive] = useState<boolean>(false);
    const [iconMenuPosition, setIconMenuPosition] = useState<Vector2d>({
        x: 0,
        y: 0,
    });
    const [cursorStyle, setCursorStyle] = useState<"auto" | "pointer">("auto");

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

            stage.scale({ x: newScale, y: newScale });
            const newPos = {
                x: pointer.x / newScale - mousePointTo.x,
                y: pointer.y / newScale - mousePointTo.y,
            };

            const newAbsolutePosition = handleDragBoundFunc(toAbsolute(newPos));

            group.position(toRelative(newAbsolutePosition));
        }
    };

    const toRelative = (absolutePosition: Vector2d) => {
        const stage = stageRef.current;
        if (!stage) return { x: 0, y: 0 };

        return {
            x: absolutePosition.x / stage.scaleX(),
            y: absolutePosition.y / stage.scaleY(),
        };
    };

    const toAbsolute = (relativePosition: Vector2d) => {
        const stage = stageRef.current;
        if (!stage) return { x: 0, y: 0 };

        return {
            x: relativePosition.x * stage.scaleX(),
            y: relativePosition.y * stage.scaleY(),
        };
    };

    const handleDragBoundFunc = (pos: Vector2d) => {
        const group = groupRef.current;
        const stage = stageRef.current;
        const image = baseMapRef.current;
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

    const moveToRelativePosition = (
        node: Konva.Node,
        tentativeRelativePosition: Vector2d,
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

    const bounceBackTo = (node: Konva.Node, pos: Vector2d) => {
        node.to({
            x: pos.x,
            y: pos.y,
            duration: BOUNCE_DURATION,
        });
    };

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
                },
            ]),
        );
    };

    const isOnIcon = (pos: Vector2d) => {
        return iconsToDraw.some((icon) => {
            return (
                pos.x >= icon.x - 50 &&
                pos.x <= icon.x + 50 &&
                pos.y >= icon.y - 50 &&
                pos.y <= icon.y + 50
            );
        });
    };

    const handleMouseMove = () => {
        const group = groupRef.current;
        if (!group) return;

        const mousePosition = group.getRelativePointerPosition()!;
        if (isOnIcon(mousePosition)) setCursorStyle("pointer");
        else setCursorStyle("auto");
    };

    const handleStageClick = () => {
        if (isIconMenuActive) {
            setIsIconMenuActive(false);
            return;
        }

        const group = groupRef.current;
        if (!group) return;

        const mousePosition = group.getRelativePointerPosition()!;
        if (isOnIcon(mousePosition)) {
            setIsIconMenuActive(true);
            setIconMenuPosition(mousePosition);
        } else {
            setIsIconMenuActive(false);
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
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="bg-secondary absolute top-3 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2">
                        <RxCorners
                            className="h-full w-full p-2"
                            onClick={restoreDefaultPositionAndScale}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Resize</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="bg-secondary absolute top-16 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2">
                        <RiDeleteBin6Line
                            className="h-full w-full p-2"
                            onClick={() => setIconsToDraw([])}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Remove all icons</p>
                </TooltipContent>
            </Tooltip>
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
                                        fill={"blue"}
                                        onDragEnd={(e) => {
                                            const newPos = e.target.position();
                                            setIconsToDraw((prev) =>
                                                prev.map(
                                                    (prevIcon, prevIndex) =>
                                                        prevIndex === index
                                                            ? {
                                                                  ...prevIcon,
                                                                  x: newPos.x,
                                                                  y: newPos.y,
                                                              }
                                                            : prevIcon,
                                                ),
                                            );
                                        }}
                                    />
                                );
                            })}
                            <Html
                                groupProps={{
                                    x: iconMenuPosition.x,
                                    y: iconMenuPosition.y,
                                }}
                            >
                                <Popover open={isIconMenuActive}>
                                    <PopoverTrigger></PopoverTrigger>
                                    <PopoverContent>
                                        <p>Gay lol</p>
                                    </PopoverContent>
                                </Popover>
                            </Html>
                        </Group>
                    </Group>
                </Layer>
            </Stage>
        </div>
    );
}
