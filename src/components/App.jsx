import React, { useState, useRef, createRef } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { GamePage, HomePage, DownPage } from "@quibbble/boardgame";
import { Game } from "./game/Game";

const config = {
  // server attributes
  host: process.env.REACT_APP_HOST,
  websocket: process.env.REACT_APP_WEBSOCKET,

  // game attributes
  key: "Stratego",
  variants: {},
  minTeams: 2,
  maxTeams: 2,

  // styling attributes
  font: "coquette",
  color: "blue-600",

  // misc attributes
  gamePageMaxWidth: "max-w-xl"
}

export default function App() {
    const ref = createRef();
    const ws = useRef();

    const [game, setGame] = useState();
    const [network, setNetwork] = useState();
    const [chat, setChat] = useState([]);
    const [connected, setConnected] = useState();
    const [error, setError] = useState();
  
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/:gameID" element=
            { 
              <GamePage config={ config }
                ref={ ref } ws={ ws }
                game={ game } setGame={ setGame }
                network={ network } setNetwork={ setNetwork }
                chat={ chat } setChat={ setChat }
                connected={ connected } setConnected={ setConnected }
                error={ error } setError={ setError }>
                  <Game ref={ ref } ws={ ws }
                    game={ game } network={ network } 
                    chat={ chat } connected={ connected } error={ error } />
              </GamePage>
            }
          />
          <Route exact path="/status/down" element={ <DownPage config={ config } /> }/>
          <Route path="/" element={ <HomePage config={ config } /> } />
        </Routes>
      </BrowserRouter>
    );
  }
