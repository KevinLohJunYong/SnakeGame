import logo from './logo.svg';
import './App.css';
import Node from './Node/Node.jsx';
import React, { Component } from 'react';

const ROWS = 20;
const COLS = 20;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
        grid: [],
    };
  }
  render() {
    return (
        <div>
          <div className="centerGrid">
            {this.setGrid()}
          </div>
        </div>
    );
  }
  setGrid() {
    return (
      this.state.grid.map((row) => {
        return (
           <div>
             {row.map((node)=>{
               const {isSnakeNode,isFoodNode,row,col} = node;
               return (
                   <Node
                    isSnakeNode={isSnakeNode}
                    isFoodNode={isFoodNode}
                    row={row}
                    col={col}>
                   </Node>
               );
             })}
           </div>
        );
      })
    );
  }
  componentDidMount() {
    const board = [];
    for(let r=0;r<ROWS;r++) {
      const row  = [];
      for(let c=0;c<COLS;c++) {
         row.push(this.createNode(r,c));
      }
      board.push(row);
    }
    this.setState({grid:board});
  }
  createNode(r,c) {
   const node = {
      isSnakeNode: this.checkIfSnakeNode(r,c) ? true : false,
      isFoodNode: this.checkIfFoodNode(r,c) ? true : false,
      row: r,
      col: c,
   }
   return node;
  }
  checkIfFoodNode(r,c) {
    return r == 5 && c == 16;
  }
  checkIfSnakeNode(r,c) {
    return r == 5 && c == 3;
  }
}
