import React, { useEffect, useRef, useState } from "react";
import { BsArrowUp, BsArrowLeft } from "react-icons/bs";
import { IoIosSwap } from "react-icons/io"
import { LuSword } from "react-icons/lu"
import { CONFIG } from "../components/Config";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import DropSpace from "./game/DropSpace";
import Unit, { TxtMap } from "./game/Unit";


export default function GamePage() {
    const history = useHistory();
    const { gid } = useParams();

    // websocket connectivity logic 
    const ws = useRef();
    const [game, setGame] = useState();
    const [network, setNetwork] = useState();
    // const [chat, setChat] = useState([]);
    const [connected, setConnected] = useState();
    // const [error, setError] = useState();

    useEffect(() => {
        ws.current = new WebSocket(`ws${ CONFIG.scheme }://${ CONFIG.host }/game/join?GameKey=${ CONFIG.key }&GameID=${ gid }`);
        ws.current.onopen = () => {};
        ws.current.onclose = () => history.push("/");
        ws.current.onmessage = async e => {
            let msg = JSON.parse(e.data);
            console.log(msg);
            if (msg.Type === "Game") setGame(msg.Payload);
            else if (msg.Type === "Network") setNetwork(msg.Payload);
            // else if (msg.Type === "Chat") setChat(c => c.concat([msg.Payload]));
            else if (msg.Type === "Connected") setConnected(msg.Payload);
            // else if (msg.Type === "Error") setError(msg.Payload);
        };
        ws.current.onerror = () => history.push("/");
    }, [ws, history, gid]);

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

    // websocket messages
    const setTeam = (team) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "SetTeam", "MoreDetails": {"Team": team}}));
    }

    const resetGame = () => {
        if (!ws.current) return;
        const variant = game ? game.MoreData.Variant : "Classic"
        ws.current.send(JSON.stringify({"ActionType": "Reset", "MoreDetails": {"MoreOptions": {"Seed": Date.now(), "Variant": variant }}}));
    }

    const switchUnits = (team, row, col, switchRow, switchCol) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "SwitchUnits", "Team": team, "MoreDetails": {"UnitRow": row, "UnitColumn": col, "SwitchUnitRow": switchRow, "SwitchUnitColumn": switchCol}}));
    }

    const moveUnit = (team, row, col, moveRow, moveCol) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "MoveUnit", "Team": team, "MoreDetails": {"UnitRow": row, "UnitColumn": col, "MoveRow": moveRow, "MoveColumn": moveCol}}));
    }

    // trigger used to force a refresh of the page
    const [trigger, setTrigger] = useState(true);
    useEffect(() => {
        const handleResize = () => setTrigger(!trigger);
        window.addEventListener("resize", handleResize);
        return _ => window.removeEventListener("resize", handleResize)
    });

    // copied logic
    const [copied, setCopied] = useState(0);
    useEffect(() => {
        if (copied > 0) setTimeout(() => setCopied(copied-1), 1000);
    }, [copied]);

    // board resize logic
    const [tileSize, setTileSize] = useState(0);
    const ref = useRef(null);
    function handleResize() {
        const width = 10;
        if (!ref || !ref.current) return;
        else setTileSize(ref.current.clientWidth/width);
    }
    useEffect(() => handleResize());
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return _ => window.removeEventListener("resize", handleResize)
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center p-2 md:p-4">
            <div ref={ref} className="h-full w-full flex flex-col items-center max-w-xl grow">
                {/* TAILWIND HACK - Tailwind preloads only used classes so anything not in initial render will not work */}
                <div className="text-red-500 text-blue-500 text-green-500 text-yellow-500 text-orange-500 text-pink-500 text-purple-500 text-teal-500"/>
                <div className="border-red-500 border-blue-500 border-green-500 border-yellow-500 border-orange-500 border-pink-500 border-purple-500 border-teal-500"/>
                <div className="bg-red-500 bg-blue-500 bg-green-500 bg-yellow-500 bg-orange-500 bg-pink-500 bg-pink-500 bg-purple-500 bg-teal-500"/>
                <div className="fill-red-500 fill-blue-500 fill-green-500 fill-yellow-500 fill-orange-500 fill-pink-500 fill-pink-500 fill-purple-500 fill-teal-500"/>
                {/* END HACK */}
                <div className="relative w-full mb-1 justfy-self-start font-thin text-sm">
                    Share this link with friends:&nbsp;
                    <span className="underline cursor-pointer" onClick={() => {
                        setCopied(1);
                        navigator.clipboard.writeText(`${ window.location.protocol }//${ window.location.host }/${ gid }`)
                    }}>
                        { `${ window.location.protocol }//${ window.location.host }/${ gid }` }
                    </span>
                    {
                        copied > 0 ?
                            <div className="absolute mt-2 w-full flex justify-center">
                                <div className="absolute top-[-12px] w-6 overflow-hidden inline-block">
                                    <div className=" h-4 w-4 bg-zinc-600 rotate-45 transform origin-bottom-left" />
                                </div>
                                <div className="font-bold text-xs text-center bg-zinc-600 px-2 py-1">copied!</div>
                            </div> : null
                    }
                </div>
                <hr className="w-full mb-2"/>
                <div className="flex w-full justify-between items-center mb-4">
                    <div className="flex">
                        { game ? game.Teams.map(el => <div key={ el } className={ `text-xs flex items-center justify-center font-bold cursor-pointer mr-1 w-6 h-6 rounded-full border-4 border-${ el }-500 ${ network && connected && connected[network.Name] === el  ? `bg-${ connected[network.Name] }-500` : "" }` } onClick={ () => setTeam(el) }>{ game && ["LongestPath", "MostCrossings"].includes(game.MoreData.Variant) ? game.MoreData.Points[el] : "" }</div>) : null }
                    </div>
                    <div className={ `font-extrabold ${ game && connected && network && connected[network.Name] && game.Winners.length === 0 ? `text-${ game.Turn }-500` : "text-zinc-100" }` }>
                        { 
                            game && connected && network && connected[network.Name] ? 
                                game.Message : 
                                <div className="flex items-center">
                                    <BsArrowLeft className="mr-1" />
                                    <div>select a team</div>
                                </div>
                        }
                    </div>
                </div>

                <DndProvider backend={ isMobile ? TouchBackend : HTML5Backend }>
                    <div className="my-2 text-zinc-400 text-xs font-light italic text-right w-full">
                        { 
                            battle && battle.AttackingUnit && battle.AttackedUnit ? 
                                <p>
                                    <span className={`text-${battle.AttackingUnit.Team}-500`}>{battle.AttackingUnit.Type} ({TxtMap[battle.AttackingUnit.Type]})</span> attacked <span className={`text-${battle.AttackedUnit.Team}-500`}>{battle.AttackedUnit.Type} ({TxtMap[battle.AttackedUnit.Type]})</span> and { battle.WinningTeam === "" ? "tied" : battle.AttackingUnit.Team === battle.WinningTeam ? "won" : "lost" }
                                </p> : <></> 
                        }
                    </div>

                    <div className="h-full flex flex-col justify-center items-center grow">
                        <div className="box-border flex flex-col mb-4" style={{ width: `${ tileSize*10 }px`, height: `${ tileSize*10 }px` }}>
                            { 
                                game ? game.MoreData.Board.map((row, rIdx) => 
                                    <div key={ rIdx } className="w-full h-full flex">
                                        {
                                            row.map((el, cIdx) => 
                                                <DropSpace key={ cIdx } row={ rIdx } col={ cIdx }>
                                                    <div className="box-border border border-zinc-100" style={{ width: `${tileSize}px`, height: `${tileSize}px` }}>
                                                        {
                                                            el ? <Unit key={ rIdx + "," + cIdx} row={ rIdx } col={ cIdx } team={ el.Team ? el.Team : "" } type={ el.Type ? el.Type : "" } turn={ game.Turn } selectedTeam={ connected && network ? connected[network.Name] : "" } moveUnit={ moveUnit } switchUnits={ switchUnits } started={game ? game.MoreData.Started : false } board={ game ? game.MoreData.Board : [] } /> : <></>
                                                        }
                                                    </div>
                                                </DropSpace>) 
                                        }
                                    </div>) : null
                            }
                        </div>

                        <div className="mb-4 w-full flex justify-between items-center" style={{ height: `${tileSize}px` }}>
                            <div className="flex flex-col items-center text-zinc-400 max-w-[20%]">
                                <div className="text-xs font-light italic mb-1 text-center">Swap units to reorder your board</div>
                                <IoIosSwap />    
                            </div> 
                            <div className="flex flex-col items-center text-zinc-400 max-w-[20%]">
                                <div className="text-xs font-light italic mb-1 text-center">Move unit to open space to start game</div>
                                <BsArrowUp />    
                            </div>      
                            <div className="flex flex-col items-center text-zinc-400 max-w-[20%]">
                                <div className="text-xs font-light italic mb-1 text-center">Move unit onto enemy to attack</div>
                                <LuSword />    
                            </div>
                        </div>
                    </div>
                </DndProvider>

                <hr className="w-full mb-2"/>
                <div className="w-full flex justify-between items-center">
                    <div className="title leading-4 text-2xl font-black text-blue-600 cursor-pointer">
                        <a href={ `${ window.location.protocol }//${ window.location.host }` }>
                            Stratego
                            <span className="ml-1 raleway text-[0.5rem] md:text-xs text-zinc-100">{ game ? game.MoreData.Variant : "" }</span>
                        </a>
                    </div>
                    <div className="flex">
                        <div className="flex">
                            <div className="px-3 py-1 font-bold cursor-pointer flex items-center justify-center text-xs bg-zinc-600 mr-2" onClick={ () => resetGame() }>new game</div>
                        </div>
                        <div className="italic text-xs bg-blue-500 py-1 px-2">
                            <a href="https://quibbble.com">more <span className="quibbble text-sm not-italic">quibbble</span> games</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
}
