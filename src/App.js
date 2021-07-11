import React, { useState,useEffect,useRef } from 'react';
import './App.css';

const BOARD_SIZE = 27;
const STARTING_SNAKE_ROW = 9;
const STARTING_SNAKE_COL = 9;
const STARTING_FOOD_ROW = 9;
const STARTING_FOOD_COL = 18;

class SnakeNode {
   constructor(row,col) {
       this.row = row;
       this.col = col;
       this.prev = null;
       this.next = null;
   }
}
class Snake {
    constructor(row,col) {
        const snakeNode = new SnakeNode(row,col);
        this.head = snakeNode;
        this.tail = snakeNode;
    }
    toString = () => {
       var string = "";
       var curr = this;
       while(curr != null && curr.head != null) {
           string += curr.head.col + ",";
           curr = curr.tail;
       }
       return string;
    };
}
const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};

export default function Board() {
    const [board,setBoard] = useState(createBoard());
    var [snake,setSnake] = useState(new Snake(STARTING_SNAKE_ROW,STARTING_SNAKE_COL));
    const [snakeCells,setSnakeCells] = useState(new Set([STARTING_SNAKE_ROW*BOARD_SIZE+STARTING_SNAKE_COL]));
    const [direction,setDirection] = useState(Direction.RIGHT);
    //to implement useEffect
   useInterval(() => {
     moveSnake();
   }, 150);
   const convertToId = (row,col) => {
      return row * BOARD_SIZE + col;
   } 
   const growSnake = () => {
       const newSnake = snake;
       if(direction == Direction.RIGHT) {
           const new_tail = new SnakeNode(newSnake.tail.row,newSnake.tail.col-1);
           newSnake.tail.prev = new_tail;
           new_tail.next = newSnake.tail;
           newSnake.tail = new_tail;
           const newSnakeCells = new Set(snakeCells);
           // alert(convertToId(new_tail.row,new_tail.col));
           newSnakeCells.add(convertToId(new_tail.row,new_tail.col-1));
           setSnakeCells(newSnakeCells);
           setSnake(newSnake);
       }
       //alert(newSnake.toString());
   }
   const moveSnake = () => {
     const currHeadRow = snake.head.row;
     const currHeadCol = snake.head.col;
     var nextHeadRow = currHeadRow;
     var nextHeadCol = currHeadCol;
     if(direction == Direction.RIGHT) {
         nextHeadCol++;
         if(nextHeadCol == BOARD_SIZE) {
             // handleGameOver();
             return;
         }
     }
     const newBoard = board.slice();
     /*
     for(const snakeCell of snakeCells) {
         // alert(Math.floor(snakeCell / BOARD_SIZE));
      newBoard[Math.floor(snakeCell / BOARD_SIZE)][snakeCell % BOARD_SIZE].isSnakeCell 
        = false;
     }
     */
     for(let r=0;r<BOARD_SIZE;r++) {
         for(let c=0;c<BOARD_SIZE;c++) {
             newBoard[r][c].isSnakeCell = false;
         }
     }
     // alert(snake.toString());
     const newSnake = new Snake(nextHeadRow,nextHeadCol);
     var newSnakeNode = newSnake.head;
     var previousSnakeNode = snake.head;
     while(previousSnakeNode.prev != null) {
         newSnakeNode.prev = previousSnakeNode;
         previousSnakeNode.next = newSnakeNode;
         previousSnakeNode = previousSnakeNode.prev;
         newSnakeNode = newSnakeNode.prev;
     }
     // alert(nextHeadCol);
     // alert(nextHeadRow);
     newSnake.tail = newSnakeNode;
     var newSnakePointer = newSnake.head;
     const newSnakeCells = new Set();
     while(newSnakePointer != null) {
         const id = convertToId(newSnakePointer.row,newSnakePointer.col);
         newSnakeCells.add(id);
         newSnakePointer = newSnakePointer.prev;
     }
     for(const snakeCell of newSnakeCells) {
          // alert(snakeCell);
          // alert(newSnakeCells.size);
        newBoard[Math.floor(snakeCell/BOARD_SIZE)][snakeCell % BOARD_SIZE].isSnakeCell 
        = true;
     }
     // alert(newSnake.head.row);
     if(board[nextHeadRow][nextHeadCol].isFoodCell) {
         growSnake();
         newBoard[nextHeadRow][nextHeadCol].isFoodCell = false;
         for(const snakeCell of snakeCells) {
          //alert(Math.floor(snakeCell / BOARD_SIZE));
          //alert(snakeCell % BOARD_SIZE);
         newBoard[Math.floor(snakeCell / BOARD_SIZE)][snakeCell % BOARD_SIZE].isSnakeCell 
           = true;
        }
     }
     setBoard(newBoard);
     setSnake(newSnake);
     setSnakeCells(newSnakeCells);
   };

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
// Copied from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
function getClassName(cell) {
    // alert(cell.col);
    if(cell.isSnakeCell) return 'cell snake-cell';
    else if(cell.isFoodCell) {
        return 'cell food-cell';
    }
    return 'cell';
} 
