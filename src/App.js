import React, { useState } from 'react';
import './App.css';

const BOARD_SIZE = 27;
const STARTING_SNAKE_ROW = 9;
const STARTING_SNAKE_COL = 9;
const STARTING_FOOD_ROW = 9;
const STARTING_FOOD_COL = 18;

export default function Board() {
    const [board,setBoard] = useState(createBoard());
    return (
        <div className="board">
            {
      board.map((row)=>{
          return (
              <div>
                  {
                      row.map((cell)=> {
                          return (
                               <div className={getClassName(cell)}>
                                </div>
                          );
                      }
                      )
                  }
              </div>
          )
      })
    }
      </div>
    );
}

function createBoard() {
    const board = [];
    for(let r=0;r<BOARD_SIZE;r++) {
        const row = [];
        for(let c=0;c<BOARD_SIZE;c++) {
            const cell = {
                row: r,
                col: c,
                isSnakeCell: r == STARTING_SNAKE_ROW && c == STARTING_SNAKE_COL,
                isFoodCell: r == STARTING_FOOD_ROW && c == STARTING_FOOD_COL,
            };
            row.push(cell);
        }
        board.push(row);
    }
    return board;
}

function getClassName(cell) {
    // alert(cell.col);
    if(cell.isSnakeCell) return 'cell snake-cell';
    else if(cell.isFoodCell) {
        return 'cell food-cell';
    }
    return 'cell';
} 
