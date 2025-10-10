import React, { useState } from "react";
import { CgCornerDoubleRightDown } from "react-icons/cg";

// type Props = {}
type Color = "red" | "blue";

function ColorPicker() {
    const [color, setColor] = useState<Color>("blue");

    const colorMappings: Record<Color, string> = {
        red: "bg-red-500",
        blue: "bg-blue-500",
    };

    const getOppositeColor = () => {
        if (color == "red") {
            return "blue";
        }
        return "red";
    };

    return (
        <div>
            {/* <div className={`border-2 border-slate-800 w-8 h-8 rounded-full cursor-pointer ${colorMappings[color]}`} onClick={toggleColor}></div> */}
            <div
                className="relative h-8 w-8 cursor-pointer"
                onClick={() => setColor(getOppositeColor())}
            >
                <div
                    className={`absolute top-0 left-0 h-6.5 w-6.5 rounded-full border-1 border-slate-800 ${colorMappings[color]}`}
                ></div>
                <CgCornerDoubleRightDown className="absolute top-1 -right-1" />
                <div
                    className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-1 border-slate-800 ${colorMappings[getOppositeColor()]}`}
                ></div>
            </div>
        </div>
    );
}

export default ColorPicker;
