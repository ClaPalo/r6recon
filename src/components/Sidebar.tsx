import React from "react";
import { AiFillEye } from "react-icons/ai";
import { FaBomb, FaRunning } from "react-icons/fa";
import { GiAk47 } from "react-icons/gi";
import { IoBagSharp } from "react-icons/io5";
import ColorPicker from "./ColorPicker";

function Sidebar() {
    return (
        <div className="flex h-full w-20 grow-1 flex-col items-center justify-start gap-5 border-r-1 border-solid border-slate-800 pt-5">
            <ColorPicker />
            <FaRunning
                size={"2rem"}
                className="transition-all ease-in hover:scale-110"
            />
            <GiAk47
                size={"2rem"}
                className="transition-all ease-in hover:scale-110"
            />
            <IoBagSharp
                size={"2rem"}
                className="transition-all ease-in hover:scale-110"
            />
            <FaBomb
                size={"2rem"}
                className="transition-all ease-in hover:scale-110"
            />
            <AiFillEye
                size={"2rem"}
                className="transition-all ease-in hover:scale-110"
            />
        </div>
    );
}

export default Sidebar;
