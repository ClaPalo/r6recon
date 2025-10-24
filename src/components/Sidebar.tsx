import { AiFillEye } from "react-icons/ai";
import { FaBomb, FaRunning } from "react-icons/fa";
import { GiAk47 } from "react-icons/gi";
import { IoBagSharp } from "react-icons/io5";
import ColorPicker from "@/components/ColorPicker";
import type { Icon } from "@/types/index";

type SidebarProps = {
    handleDragStart: (icon: Icon) => void;
};

export default function Sidebar(props: SidebarProps) {
    const { handleDragStart } = props;

    return (
        <div className="flex h-full w-20 flex-col items-center justify-start gap-5 border-r-4 border-solid border-slate-800 p-5">
            <ColorPicker />
            <div draggable onDragStart={() => handleDragStart("running")}>
                <FaRunning
                    size={"2rem"}
                    className="transition-all ease-in hover:scale-110"
                />
            </div>
            <div draggable onDragStart={() => handleDragStart("gun")}>
                <GiAk47
                    size={"2rem"}
                    className="transition-all ease-in hover:scale-110"
                />
            </div>
            <div draggable onDragStart={() => handleDragStart("defuser")}>
                <IoBagSharp
                    size={"2rem"}
                    className="transition-all ease-in hover:scale-110"
                />
            </div>
            <div draggable onDragStart={() => handleDragStart("bomb")}>
                <FaBomb
                    size={"2rem"}
                    className="transition-all ease-in hover:scale-110"
                />
            </div>
            <div draggable onDragStart={() => handleDragStart("eye")}>
                <AiFillEye
                    size={"2rem"}
                    className="transition-all ease-in hover:scale-110"
                />
            </div>
        </div>
    );
}
