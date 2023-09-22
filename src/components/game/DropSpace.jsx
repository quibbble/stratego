import React from "react";
import { useDroppable } from '@dnd-kit/core';

export default function DropSpace({row, col, children}) {
    const {isOver, setNodeRef} = useDroppable({
        id: "space:" + row + "," + col,
        data: {
            row: row,
            col: col
        }
    });

    return (
        <div ref={ setNodeRef } className={ isOver ? "bg-zinc-500" : "" }>{ children }</div>
    )
}
