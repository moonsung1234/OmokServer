
import React from "react";
import Omok from "./omok";

class Board extends React.Component {
  constructor(props) {
    super(props);
    
    this.omok = new Omok();
    this.omok.set();
    this.state = { board : this.omok.board };
  }

  set() {
    let board = [];

    for(let i=0; i<this.omok.board_size[0]; i++) {
      let line = [];

      for(let j=0; j<this.omok.board_size[1]; j++) {
        let background_color = "#FFCC99";

        if(this.state.board[i][j] == this.omok.white_c) background_color = "white";
        if(this.state.board[i][j] == this.omok.black_c) background_color = "black";

        line.push(
          <div 
            style={{ 
              display: "inline-block",
              width: window.screen.availHeight / 15 + "px",
              height: "100%",
              border: "1px solid brown",
              background: background_color
            }} 
            key={`${i} ${j}`}
            id={`${i} ${j}`}
            onClick={this.put.bind(this)}>
          </div>
        );
      }

      board.push(
        <div 
          key={i}
          style={{
            width: "100%",
            height: window.screen.availHeight / 15 + "px"
          }}>
          {line}
        </div>
      );
    }

    return board;
  }

  put(e) {
    let target = e.target
    let [x, y] = target.id.split(" ").map(n => parseInt(n));

    if(this.omok.put(x, y)) {
      alert(this.omok.turn + " win!");
      
      this.omok.set();
    }

    this.setState({ board : this.omok.board });
  }

  render() {
    return (
      <div id="board">
        {this.set()}
      </div>
    );
  }
}

function App() {
  return (
    <Board />
  );
}

export default App;
