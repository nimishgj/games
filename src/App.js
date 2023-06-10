import React, { useState, useReducer } from 'react';
import Card from "./components/Card";
import Snakegame from "./components/Snakegame";
import ParentTenzies from './components/ParentTenzies';
import FlappyBird from './components/FlappyBird';
import TicTacToe from './components/TicTacToe';
import "./App.css";
import flappybird from "./images/flappybird.png";
import snakegame from "./images/snakegame.png";
import tenzies from "./images/tenzies.png";
import tictactoe from "./images/tictactoe.png";

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    gameSelected: false,
    snakegame: false,
    flappybird: false,
    tictactoe: false,
    tenzies: false
  });

  function reducer(state, action) {
    switch (action) {
      case 'snakegame':
        return { gameSelected: true, snakegame: true, flappybird: false, tictactoe: false, tenzies: false };
      case 'flappybird':
        return { gameSelected: true, snakegame: false, flappybird: true, tictactoe: false, tenzies: false };
      case 'tenzies':
        return { gameSelected: true, snakegame: false, flappybird: false, tictactoe: false, tenzies: true };
      case 'tictactoe':
        return { gameSelected: true, snakegame: false, flappybird: false, tictactoe: true, tenzies: false };
      case 'reset':
        return {
          gameSelected: false,
          snakegame: false,
          flappybird: false,
          tictactoe: false,
          tenzies: false
        };
      default:
        return state;
    }
  }

  return (
    <>
    <div onClick={() => dispatch('reset')} className='home'>Home</div>
      {!state.gameSelected && (
        <div className='backGround'>
          <div className='title'>Hey there, Gamers</div>
          <div className='games'>
            <div onClick={() => dispatch('flappybird')}>
              <Card image={flappybird}/>
            </div>
            <div onClick={() => dispatch('snakegame')}>
              <Card image={snakegame}/>
            </div>
            <div onClick={() => dispatch('tenzies')}>
              <Card image={tenzies}/>
            </div>
            <div onClick={() => dispatch('tictactoe')}>
              <Card image={tictactoe}/>
            </div>
          </div>
          <div className='title'>More Games Coming, Stay tuned</div>
        </div>
      )}
      {state.flappybird && <FlappyBird/>}
      {state.tictactoe && <TicTacToe/>}
      {state.tenzies && <ParentTenzies/>}
      {state.snakegame && <Snakegame/>}

      
    </>
  );
}
