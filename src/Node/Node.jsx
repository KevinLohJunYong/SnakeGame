import styles from './Node.css';
import React, { Component } from 'react';

export default class Node extends React.Component {
    render() {
       const {
          isSnakeNode,
          isFoodNode,
          row,
          col,
       } = this.props;
       const _className = isSnakeNode ? 'node-snake' : isFoodNode ? 'node-food' : ' ';
       return (
          <div
             className={`node ${_className}`}>
             </div>
       );
    }
}