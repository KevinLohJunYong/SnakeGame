import React, { useState,useEffect,useRef } from 'react';
import Button from '@material-ui/core/Button';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
const IS_SMALL_SCREEN = window.screen.width <= 1000;
const IS_REALLY_SMALL_SCREEN = window.screen.width <= 500;
const BOARD_SIZE = IS_SMALL_SCREEN ? 9 : 15;
const STARTING_SNAKE_ROW = IS_SMALL_SCREEN ? 2 : 3;
const STARTING_SNAKE_COL = IS_SMALL_SCREEN ? 2 : 3;
const STARTING_FOOD_ROW = IS_SMALL_SCREEN ? 2 : 3;
const STARTING_FOOD_COL = IS_SMALL_SCREEN ? 6 : 11;

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
const useStyles = makeStyles((theme) => ({
    icon: {
      '& svg': {
        fontSize: 100
      }
    },
  }));
export default function Board() {
    const classes = useStyles();
    const [board,setBoard] = useState(createBoard());
    var [snake,setSnake] = useState(new Snake(STARTING_SNAKE_ROW,STARTING_SNAKE_COL));
    const [snakeCells,setSnakeCells] = useState(new Set([STARTING_SNAKE_ROW*BOARD_SIZE+STARTING_SNAKE_COL]));
    const [direction,setDirection] = useState(Direction.RIGHT);
    const [score,setScore] = useState(0);
    const [gameState,setGameState] = useState("RUNNING");
    const [hasAlerted,setHasAlerted] = useState(false);
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
       const currTail = newSnake.tail;
       var newTail = null;
       if(direction === Direction.UP) {
          newTail = new SnakeNode(currTail.row+1,currTail.col);
       }
       else if(direction === Direction.DOWN) {
          newTail = new SnakeNode(currTail.row-1,currTail.col);
       }
       else if(direction === Direction.LEFT) {
          newTail = new SnakeNode(currTail.row,currTail.col+1);
       }
       else {
          newTail = new SnakeNode(currTail.row,currTail.col+1);
       }
       const newTailId = convertToId(newTail.row,newTail.col);
       const newSnakeCells = new Set(snakeCells);
       newSnakeCells.add(newTailId);
       setSnakeCells(newSnakeCells);
       currTail.prev = newTail;
       newSnake.tail = null;
       newSnake.tail = newTail;
       // alert(newSnake.tail);
       // alert(newSnake.tail.toString());
       setSnake(newSnake);
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
            default:
                break;
        }
     };
   }
   const togglePauseButton = () => {
       var isRunning = gameState === "RUNNING";
       if(isRunning) {
           isRunning = false;
           setGameState("PAUSED");
       } 
       else {
           setGameState("RUNNING");
       }
       document.getElementById("pause-button").innerHTML = isRunning ? "Pause" : "Unpause";
   }
   async function handleGameOver() {
       document.getElementById("score_div").innerHTML = 
        `Game Over! Your score is ${score}`;
       setScore(0);
       await new Promise(r => setTimeout(r, 1000));
       window.location.reload();
   }
   const moveSnake = () => {
     if(gameState === "PAUSED") return;
     if(IS_REALLY_SMALL_SCREEN && !hasAlerted) {
        alert('It looks like your screen is a bit small, consider rotating your screen or using a computer for a better experience! :D')
        setHasAlerted(true);
    }
     var expected_tail = snake.tail;
     while(expected_tail.prev != null) {
           expected_tail = expected_tail.prev;
     }
     snake.tail = expected_tail;
     const currHeadRow = snake.head.row;
     const currHeadCol = snake.head.col;
     var nextHeadRow = currHeadRow;
     var nextHeadCol = currHeadCol;
     changeDirectionOptionally();
     //if direction is right, incr col by 1
     if(direction === Direction.RIGHT) {
         nextHeadCol++;
         if(nextHeadCol === BOARD_SIZE) {
             handleGameOver();
             return;
         }
     }
     if(direction === Direction.LEFT) {
        nextHeadCol--;
        if(nextHeadCol < 0) {
            handleGameOver();
            return;
        }
    }
    if(direction === Direction.UP) {
        nextHeadRow--;
        if(nextHeadRow < 0) {
            handleGameOver();
            return;
        }
    }
    if(direction === Direction.DOWN) {
        nextHeadRow++;
        if(nextHeadRow === BOARD_SIZE) {
            handleGameOver();
            return;
        }
    }
     const newBoard = board.slice();
     //the snake moves every time, so clear board of previous green nodes 
     for(const snakeCell of snakeCells) {
         // alert(Math.floor(snakeCell / BOARD_SIZE));
      newBoard[Math.floor(snakeCell / BOARD_SIZE)][snakeCell % BOARD_SIZE].isSnakeCell 
        = false;
     }
     // moving the snake to the next direction
     const newSnake = new Snake(nextHeadRow,nextHeadCol);
     var currSnakeNode = newSnake.head;
     var previousSnakeNode = snake.head;
     // if(previousSnakeNode.prev != null) alert(previousSnakeNode.prev.toString());
     while(previousSnakeNode.prev != null) {
         currSnakeNode.prev = new SnakeNode(previousSnakeNode.row,previousSnakeNode.col);
         previousSnakeNode = previousSnakeNode.prev;
         currSnakeNode = currSnakeNode.prev;
     }
     setSnake(newSnake);
     var newSnakePointer = newSnake.head;
     const newSnakeCells = new Set();
     while(newSnakePointer != null) {
         const id = convertToId(newSnakePointer.row,newSnakePointer.col);
         if(newSnakeCells.has(id)) {
             handleGameOver();
             return;
         }
         newSnakeCells.add(id);
         newSnakePointer = newSnakePointer.prev;
     }
     for(const snakeCell of newSnakeCells) {
        newBoard[Math.floor(snakeCell/BOARD_SIZE)][snakeCell % BOARD_SIZE].isSnakeCell 
        = true;
     }
     if(board[nextHeadRow][nextHeadCol].isFoodCell) {
         setScore(score+1);
         growSnake();
         randomlySpawnFoodCell();
         newBoard[nextHeadRow][nextHeadCol].isFoodCell = false;
         for(const snakeCell of snakeCells) {
         newBoard[Math.floor(snakeCell / BOARD_SIZE)][snakeCell % BOARD_SIZE].isSnakeCell 
           = true;
         }
         setBoard(newBoard);
         setSnakeCells(newSnakeCells);
     }
     else {
       setBoard(newBoard);
       setSnake(newSnake);
       setSnakeCells(newSnakeCells);
     }
   };
    return ( 
        <div>
            <div style={{display:"block",textAlign:"center"}}>
              <div>
                <h1 id="score_div"> Score : {score} 
                 <Button id="pause-button" style={{textTransform:"none",fontSize:"large"}} size="large" onClick={()=>togglePauseButton()}> 
                    Pause 
                 </Button>
                </h1>
              </div>
            </div>
            <div style={{marginLeft:"9%",marginTop:getMarginTop()}}>
                 <IconButton className={classes.icon} style={{marginLeft:getMarginLeft()}} onClick={()=>setDirection(Direction.UP)}>
                   <ArrowDropUp fontSize="large"> </ArrowDropUp>
                 </IconButton>
                <div style={{marginTop:getMarginTopForArrowLeftAndRight()}}>
                <IconButton className={classes.icon} onClick={()=>setDirection(Direction.LEFT)}>
                  <ArrowLeft fontSize="large"> </ArrowLeft>
                  </IconButton>
                  <IconButton className={classes.icon} onClick={()=>setDirection(Direction.RIGHT)}>
                  <ArrowRight fontSize="large"> </ArrowRight>
                  </IconButton>
                </div>
                <IconButton className={classes.icon} style={{marginLeft:getMarginLeft(),marginTop:"-4%"}} onClick={()=>setDirection(Direction.DOWN)}>
                <ArrowDropDown fontSize="large"> 
                </ArrowDropDown>
                </IconButton>
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
                isSnakeCell: r === STARTING_SNAKE_ROW && c === STARTING_SNAKE_COL,
                isFoodCell: r === STARTING_FOOD_ROW && c === STARTING_FOOD_COL,
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
function getMarginTop() {
    return IS_SMALL_SCREEN ? "0%" : "9%";
}
function getMarginLeft() {
    return IS_SMALL_SCREEN ? "7.5%" : "4.5%";
}
function getMarginTopForArrowLeftAndRight() {
    return IS_SMALL_SCREEN ? "-5%" : "-4%";
}

