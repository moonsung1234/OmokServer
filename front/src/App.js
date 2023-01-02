
import React from "react";
import Omok from "./omok";
import io from "socket.io-client";

let socket = io.connect(window.location.href);

socket.on("full", () => {
  alert("Other players already playing now. Try later.");

  socket.disconnect();
});

class Board extends React.Component {
  constructor(props) {
    super(props);
    
    this.omok = new Omok();
    this.omok.set();
    this.state = { board : this.omok.board };

    socket.on("end", () => {
      alert("disconnect");
    
      this.socket.set();

      socket.disconnect();
    });

    socket.on("turn", turn => {
      this.turn = turn;
    });

    socket.on("put", pos => {
      let [x, y] = pos;

      this.put(x, y);

      // alert("상대방이 뒀습니다.");
    });
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
            onClick={this.click.bind(this)}>
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

  put(x, y) {
    this.setState({ board : this.omok.board });

    if(this.omok.put(x, y)) {
      alert(this.omok.turn + " win!");
      
      this.omok.set();

      socket.emit("end", "");
    }
  }

  click(e) {
    if(this.turn != this.omok.turn) return;

    let target = e.target
    let [x, y] = target.id.split(" ").map(n => parseInt(n));

    socket.emit("put", [x, y]);
    
    this.put(x, y);
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
