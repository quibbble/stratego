import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { BsArrowUp } from "react-icons/bs";
import { IoIosSwap } from "react-icons/io"
import { LuSword } from "react-icons/lu"
import DropSpace from "./DropSpace";
import { DraggableUnit, TxtMap } from "./Unit";
import { DndContext, PointerSensor, useSensors, useSensor } from '@dnd-kit/core';

export const Game = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { ws, game, network, chat, connected, error } = props;

    console.log(game)

    // websocket messages
    const sendSwitchUnitsAction = useCallback((team, row, col, switchRow, switchCol) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "SwitchUnits", "Team": team, "MoreDetails": {"UnitRow": row, "UnitColumn": col, "SwitchUnitRow": switchRow, "SwitchUnitColumn": switchCol}}));
    })

    const sendMoveUnitAction = useCallback((team, row, col, moveRow, moveCol) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "MoveUnit", "Team": team, "MoreDetails": {"UnitRow": row, "UnitColumn": col, "MoveRow": moveRow, "MoveColumn": moveCol}}));
    })

    // game data
    const [team, setTeam] = useState();
    useEffect(() => {
        if (connected && network) setTeam(connected[network.Name])
    }, [connected, network])

    // battle logic
    const [battle, setBattle] = useState({});
    useEffect(() => {
        if (game && game.MoreData && game.MoreData.Battle) {
            setBattle(game.MoreData.Battle);
        }
    }, [game, setBattle])

    // drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const handleDragEnd = useCallback((e) => {
        if (!game && !game.MoreData) return
        if (!e.over || (game.MoreData.Started && team !== game.Turn) || game.Winners.length > 0) return

        let over = e.over.data.current
        let active = e.active.data.current

        if (game && game.MoreData) {
            let started = game.MoreData.Started
            let board = game.MoreData.Board
            if (!started && board[over.row][over.col] && !(active.type === "scout" && board[active.row][active.col].Team !== board[over.row][over.col].Team)) {
                sendSwitchUnitsAction(team, active.row, active.col, over.row, over.col)
            } else {
                sendMoveUnitAction(team, active.row, active.col, over.row, over.col)
            }
        }
    }, [team, game, sendMoveUnitAction, sendSwitchUnitsAction])

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
        <DndContext onDragEnd={ handleDragEnd } sensors={ sensors }>
            <div className="h-full flex flex-col justify-center items-center grow">
                <div className="py-4 text-zinc-400 text-xs font-light italic text-right w-full">
                    <p className={ !(battle && battle.AttackingUnit && battle.AttackedUnit && game.MoreData.JustBattled) ? "opacity-0" : "" }>
                        <span className={`text-${battle.AttackingUnit.Team}-500`}>{battle.AttackingUnit.Type} ({TxtMap[battle.AttackingUnit.Type]})</span> attacked <span className={`text-${battle.AttackedUnit.Team}-500`}>{battle.AttackedUnit.Type} ({TxtMap[battle.AttackedUnit.Type]})</span> and { battle.WinningTeam === "" ? "tied" : battle.AttackingUnit.Team === battle.WinningTeam ? "won" : "lost" }
                    </p>
                </div>

                <div className="box-border flex flex-col mb-4" style={{ width: `${ tileSize*10 }px`, height: `${ tileSize*10 }px` }}>
                    { 
                        game ? game.MoreData.Board.map((row, rIdx) => 
                            <div key={ rIdx } className="w-full h-full flex">
                                {
                                    row.map((el, cIdx) => 
                                        <DropSpace key={ cIdx } row={ rIdx } col={ cIdx } team={ game && game.Actions && game.Actions.length > 0 ? game.Actions[game.Actions.length-1].Team : "" } justMoved={ game && game.Actions && game.Actions.length > 0 && game.Actions[game.Actions.length-1].ActionType === "MoveUnit" && game.Actions[game.Actions.length-1].MoreDetails.UnitRow == rIdx && game.Actions[game.Actions.length-1].MoreDetails.UnitColumn == cIdx }>
                                            <div className="box-border border border-zinc-100" style={{ width: `${tileSize}px`, height: `${tileSize}px` }}>
                                                {
                                                    el ? 
                                                        <DraggableUnit key={ rIdx + "," + cIdx} row={ rIdx } col={ cIdx } team={ el.Team ? el.Team : "" } type={ el.Type ? el.Type : "" } turn={ game.Turn } selectedTeam={ team } started={game ? game.MoreData.Started : false } winners={ game ? game.Winners : [] } /> : 
                                                        <></>
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
        </DndContext>
    )
})
