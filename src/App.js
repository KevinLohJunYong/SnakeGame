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
   toString = () => {
       var string = "snake node: ";
       var pointer = this;
       while(pointer != null) {
           string += pointer.col + ",";
           pointer = pointer.prev;
       }
       return string;
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
      var pointer = this.head;
      while(pointer != null) {
          string += pointer.col + ",";
          pointer = pointer.prev;
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
    const [score,setScore] = useState(0);
    //to implement useEffect
   useInterval(() => {
     moveSnake();
   }, 150);
   const convertToId = (row,col) => {
      return row * BOARD_SIZE + col;
   } 
   const randomlySpawnFoodCell = () => {
      while (true) {
        const randomnlyGeneratedRow = randomIntFromInterval(0,BOARD_SIZE-1);
        const randomnlyGeneratedCol = randomIntFromInterval(0,BOARD_SIZE-1);
        const iDOfRandomlyGenFoodCell = convertToId(randomnlyGeneratedRow,randomnlyGeneratedCol);
        if(!snakeCells.has(iDOfRandomlyGenFoodCell)) {
              board[randomnlyGeneratedRow][randomnlyGeneratedCol].isFoodCell = true;
              break;
        }
      }
   }
   const growSnake = () => {
       const newSnake = snake;
       const new_tail = new SnakeNode(newSnake.tail.row,newSnake.tail.col);
       newSnake.tail.prev = new_tail;
       newSnake.tail = new_tail;
        //alert(newSnake.tail == newSnake.head); //false
        const newSnakeCells = new Set(snakeCells);
        // alert(convertToId(new_tail.row,new_tail.col));
        newSnakeCells.add(convertToId(new_tail.row,new_tail.col));
        setSnakeCells(newSnakeCells);
        setSnake(newSnake);
        // alert(newSnake.toString());
   }
   const changeDirectionOptionally = () => {
     document.onkeydown = function (event) {
        switch (event.keyCode) {
           case 37:
              setDirection(Direction.LEFT);
              break;
           case 38:
              setDirection(Direction.UP);
              break;
           case 39:
             setDirection(Direction.RIGHT);
              break;
           case 40:
             setDirection(Direction.DOWN);
              break;
        }
     };
   }
   const handleGameOver = () => {
        setScore(0);
   }
   const moveSnake = () => {
     const currHeadRow = snake.head.row;
     const currHeadCol = snake.head.col;
     var nextHeadRow = currHeadRow;
     var nextHeadCol = currHeadCol;
     changeDirectionOptionally();
     //if direction is right, incr col by 1
     if(direction == Direction.RIGHT) {
         nextHeadCol++;
         if(nextHeadCol == BOARD_SIZE) {
             handleGameOver();
             return;
         }
     }
     if(direction == Direction.LEFT) {
        nextHeadCol--;
        if(nextHeadCol < 0) {
            handleGameOver();
            return;
        }
    }
    if(direction == Direction.UP) {
        nextHeadRow--;
        if(nextHeadRow < 0) {
            handleGameOver();
            return;
        }
    }
    if(direction == Direction.DOWN) {
        nextHeadRow++;
        if(nextHeadRow == BOARD_SIZE) {
            handleGameOver();
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
    //the snake moves every time, so clear board of previous green nodes 
     for(let r=0;r<BOARD_SIZE;r++) {
         for(let c=0;c<BOARD_SIZE;c++) {
             newBoard[r][c].isSnakeCell = false;
         }
     }
     // moving the snake to the next direction
     // alert(snake.toString());
     const newSnake = new Snake(nextHeadRow,nextHeadCol);
     var currSnakeNode = newSnake.head;
     var previousSnakeNode = snake.head;
     //if(previousSnakeNode.prev != null) alert(previousSnakeNode.prev.toString());
     while(previousSnakeNode.prev != null) {
         currSnakeNode.prev = new SnakeNode(previousSnakeNode.row,previousSnakeNode.col);
         previousSnakeNode = previousSnakeNode.prev;
         currSnakeNode = currSnakeNode.prev;
     }
     // based on snake, add the snake cells
     // alert(nextHeadCol);
     // alert(nextHeadRow);
     /*
     var cheat = new SnakeNode(nextHeadRow,nextHeadCol-1);
     newSnakeNode.prev = cheat;
     cheat.next = newSnakeNode;
     newSnake.tail = cheat;
     */
     // alert(newSnake.toString());
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
         setScore(score+1);
         growSnake();
         // alert('grow snake');
         newBoard[nextHeadRow][nextHeadCol].isFoodCell = false;
         for(const snakeCell of snakeCells) {
          //alert(Math.floor(snakeCell / BOARD_SIZE));
          //alert(snakeCell % BOARD_SIZE);
         newBoard[Math.floor(snakeCell / BOARD_SIZE)][snakeCell % BOARD_SIZE].isSnakeCell 
           = true;
        }
        // alert(newSnake.toString());
        setBoard(newBoard);
        // setSnake(newSnake);
        setSnakeCells(newSnakeCells);
        randomlySpawnFoodCell();
        return;
     }
     setBoard(newBoard);
     setSnake(newSnake);
     setSnakeCells(newSnakeCells);
   };
    return ( 
        <div>
            <div className="score-header">
                <h1> Score : {score} </h1>
            </div>
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
// Copied from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
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
