import React from "react";
import { useDrop } from "react-dnd";

export default function DropSpace({row, col, children}) {
    const [, drop] = useDrop(() => ({
        accept: "unit",
        drop: () => ({ row: row, col: col }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));
    return (
        <div ref={drop}>{children}</div>
    )
}
