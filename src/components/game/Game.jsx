import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { BsArrowUp } from "react-icons/bs";
import { IoIosSwap } from "react-icons/io"
import { LuSword } from "react-icons/lu"
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import DropSpace from "./DropSpace";
import Unit, { TxtMap } from "./Unit";

export const Game = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { ws, game, network, chat, connected, error } = props;

    // websocket messages
    const switchUnits = (team, row, col, switchRow, switchCol) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "SwitchUnits", "Team": team, "MoreDetails": {"UnitRow": row, "UnitColumn": col, "SwitchUnitRow": switchRow, "SwitchUnitColumn": switchCol}}));
    }

    const moveUnit = (team, row, col, moveRow, moveCol) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "MoveUnit", "Team": team, "MoreDetails": {"UnitRow": row, "UnitColumn": col, "MoveRow": moveRow, "MoveColumn": moveCol}}));
    }

    // battle logic
    const [battle, setBattle] = useState({});
    useEffect(() => {
        if (game && game.Actions) {
            for (let action of game.Actions.reverse()) {
                if (action.ActionType === "Battle") {
                    setBattle(action.MoreDetails);
                    return
                }
            }
        }
    }, [game, setBattle])

    // board resize logic
    const [tileSize, setTileSize] = useState(0);

    const handleResize = useCallback(() => {
        const width = 10;
        if (!ref || !ref.current) return;
        else setTileSize(ref.current.clientWidth/width);
    }, [ref])

    useEffect(() => handleResize());

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return _ => window.removeEventListener("resize", handleResize)
    }, [handleResize]);

    return (
        <DndProvider backend={ isMobile ? TouchBackend : HTML5Backend }>
            <div className="h-full flex flex-col justify-center items-center grow">
                <div className="py-4 text-zinc-400 text-xs font-light italic text-right w-full">
                    { 
                        battle && battle.AttackingUnit && battle.AttackedUnit ? 
                            <p>
                                <span className={`text-${battle.AttackingUnit.Team}-500`}>{battle.AttackingUnit.Type} ({TxtMap[battle.AttackingUnit.Type]})</span> attacked <span className={`text-${battle.AttackedUnit.Team}-500`}>{battle.AttackedUnit.Type} ({TxtMap[battle.AttackedUnit.Type]})</span> and { battle.WinningTeam === "" ? "tied" : battle.AttackingUnit.Team === battle.WinningTeam ? "won" : "lost" }
                            </p> : <></> 
                    }
                </div>

                <div className="box-border flex flex-col mb-4" style={{ width: `${ tileSize*10 }px`, height: `${ tileSize*10 }px` }}>
                    { 
                        game ? game.MoreData.Board.map((row, rIdx) => 
                            <div key={ rIdx } className="w-full h-full flex">
                                {
                                    row.map((el, cIdx) => 
                                        <DropSpace key={ cIdx } row={ rIdx } col={ cIdx }>
                                            <div className="box-border border border-zinc-100" style={{ width: `${tileSize}px`, height: `${tileSize}px` }}>
                                                {
                                                    el ? <Unit key={ rIdx + "," + cIdx} row={ rIdx } col={ cIdx } team={ el.Team ? el.Team : "" } type={ el.Type ? el.Type : "" } turn={ game.Turn } selectedTeam={ connected && network ? connected[network.Name] : "" } moveUnit={ moveUnit } switchUnits={ switchUnits } started={game ? game.MoreData.Started : false } winners={ game ? game.Winners : [] } board={ game ? game.MoreData.Board : [] } /> : <></>
                                                }
                                            </div>
                                        </DropSpace>) 
                                }
                            </div>) : null
                    }
                </div>

                <div className="py-8 w-full flex justify-between items-center" style={{ height: `${tileSize}px` }}>
                    <div className="flex flex-col items-center text-zinc-400 max-w-[30%] md:max-w-[25%]">
                        <div className="text-xs font-light italic mb-1 text-center">Pre-game, swap your units to reorder board</div>
                        <IoIosSwap />    
                    </div> 
                    <div className="flex flex-col items-center text-zinc-400 max-w-[30%] md:max-w-[25%]">
                        <div className="text-xs font-light italic mb-1 text-center">Move unit to open space to start game</div>
                        <BsArrowUp />    
                    </div>      
                    <div className="flex flex-col items-center text-zinc-400 max-w-[30%] md:max-w-[25%]">
                        <div className="text-xs font-light italic mb-1 text-center">Move unit onto enemy to attack</div>
                        <LuSword />    
                    </div>
                </div>
            </div>
        </DndProvider>
    )
})
