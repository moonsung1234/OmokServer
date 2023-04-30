
import React from "react";
import Omok from "./omok";

class Board extends React.Component {
    constructor(props) {
      super(props);
      
      this.is_mobile = this.props.is_mobile;
      this.socket = this.props.socket;
      this.omok = new Omok();
      this.omok.set();
      this.state = { 
        board : this.omok.get(), 
        pos : [-1, -1]
      };
      this.turn = this.props.info.turn;
      this.player = JSON.parse(window.sessionStorage.getItem("player"));
  
      this.socket.on("put", pos => {
        let [x, y] = pos;
  
        this.put(x, y);
  
        // alert("상대방이 뒀습니다.");
      });
  
      this.socket.on("out", () => {
        this.socket.emit("win", JSON.stringify(this.player));

        alert("상대방이 나갔습니다.");
      
        this.omok.set();
        this.props.tostart();
      });
  
      this.socket.on("end", () => {
        this.omok.set();
        this.props.tostart();
      });
    }
  
    set() {
      let board = [];
  
      for(let i=0; i<this.omok.board_size[0]-2; i++) {
        let line = [];
  
        for(let j=0; j<this.omok.board_size[1]-2; j++) {
          let background_color = "#FFCC99";
  
          if(this.state.board[i][j] == this.omok.white_c) background_color = "white";
          if(this.state.board[i][j] == this.omok.black_c) background_color = "black";
  
          line.push(
            <td 
              style={{ 
                // display: "inline-block",
                // width: "3vw",
                // height: "100%",
                // border: "1px solid brown",
                background: background_color,
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
                border : "1px solid brown",
                borderCollapse : "collapse"
              }}
              key={`${i} ${j}`}
              id={`${i} ${j}`}
              onClick={this.click.bind(this)}>
              {(i == this.state.pos[0] && j == this.state.pos[1])? "X" : "⠀"}
            </td>
          );
        }
  
        board.push(
          <tr 
            key={i}
            style={{
              border : "1px solid brown",
              borderCollapse : "collapse"
            }}
          >
            {line}
          </tr>
        );
      }
  
      return (
        <table 
          style={{
            width: "100%",
            height: "100%",
            border : "1px solid brown",
            borderCollapse : "collapse"
          }}
        >
          {board}
        </table>
      );
    }
  
    setMobile() {
      let board = [];
      let margin = parseInt(100 / (this.omok.board_size[0]-2));
  
      for(let i=0; i<this.omok.board_size[0]-2; i++) {
        let line = [];
  
        for(let j=0; j<this.omok.board_size[1]-2; j++) {
          let background_color = "#FFCC99";
  
          if(this.state.board[i][j] == this.omok.white_c) background_color = "white";
          if(this.state.board[i][j] == this.omok.black_c) background_color = "black";
  
          line.push(
            <div 
              style={{ 
                display: "inline-block",
                width: margin + "vw",
                height: "100%",
                border: "1px solid brown",
                background: background_color,
                textAlign: "center",
                color: "red",
                fontWeight: "bold"
              }}
              key={`${i} ${j}`}
              id={`${i} ${j}`}
              onClick={this.click.bind(this)}>
              {(i == this.state.pos[0] && j == this.state.pos[1])? "X" : "⠀"}
            </div>
          );
        }
  
        board.push(
          <div 
            key={i}
            style={{
              width: "100%",
              height: margin + "vw"
            }}>
            {line}
          </div>
        );
      }
  
      return board;
    }

    end() {
      let data = {};
      let result = this.omok.turn == this.turn? "win" : "lose";
      
      data[this.player.id] = { 
        id : this.player.id, 
        state : result 
      };
      data[this.props.info.player.id] = { 
        id : this.props.info.player.id,
        state : result == "win"? "lose" : "win" 
      }
      
      this.socket.emit("end", JSON.stringify(data));
    }
  
    put(x, y) {
      let result = this.omok.put(x, y);
      
      this.setState({ 
        board : this.omok.get(), 
        pos : result != false? [x, y] : this.state.pos
      });
  
      if(result) {
        alert(this.omok.turn == this.omok.black_c? "black" : "white" + " win!");
        
        this.end();
      }
    }
  
    click(e) {
      if(this.turn != this.omok.turn) return;
  
      let target = e.target
      let [x, y] = target.id.split(" ").map(n => parseInt(n));
  
      this.socket.emit("put", [x, y]);
      
      this.put(x, y);
    }
  
    renderMobile() {
      return (
        <div
          id="body"
          style={{
            width: "100vw",
            height: "100vh"
          }}
        >
          <div 
            id="fp"
            style={{
              background: "white",
              width: "100%",
              height: "15%",
              fontSize: "3vw",
              fontWeight: "bold",
              color: "black"
            }}
          >
            <div 
              id="title"
            >
              {this.turn == this.omok.white_c? this.player.id : this.props.info.player.id}
            </div>
          </div>
          <div 
            id="board"
            style={{
              width: "100%",
              height: "100vw"
            }}
          >
            {this.setMobile()}
          </div>
          <div 
            id="sp"
            style={{
              background: "gray",
              width: "100%",
              height: "15%",
              fontSize: "3vw",
              fontWeight: "bold",
              color: "black"
            }}
          >
            <div 
              id="title"
            >
              {this.turn == this.omok.black_c? this.player.id : this.props.info.player.id}
            </div>
          </div>
        </div>
      );
    }

    render() {
      if(this.is_mobile) {
        return this.renderMobile();

      } else {
        return (
          <div
            id="body"
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex"
            }}
          >
            <div 
              id="fp"
              style={{
                background: "white",
                width: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "3vw",
                fontWeight: "bold",
                color: "black"
              }}
            >
              <div 
                id="title"
              >
                {this.turn == this.omok.white_c? this.player.id : this.props.info.player.id}
              </div>
            </div>
            <div 
              id="board"
              style={{
                width: "60%",
                height: "100vh"
              }}
            >
              {this.set()}
            </div>
            <div 
              id="sp"
              style={{
                background: "gray",
                width: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "3vw",
                fontWeight: "bold",
                color: "black"
              }}
            >
              <div 
                id="title"
              >
                {this.turn == this.omok.black_c? this.player.id : this.props.info.player.id}
              </div>
            </div>
          </div>
        );
      }
    }
}

export default Board;