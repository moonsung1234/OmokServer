
import React from "react";
import Omok from "./omok";
import io from "socket.io-client";

let socket = null;

class Board extends React.Component {
  constructor(props) {
    super(props);
    
    this.omok = new Omok();
    this.omok.set();
    this.state = { board : this.omok.board };
    this.turn = this.props.turn;

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
      
      socket.emit("end", "");
      
      this.omok.set();
      this.props.tostart();
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

class Start extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div 
        id="start"
        style={{ 
          width: "100%",
          height: "100%"
        }}
      >
        <div 
          id="title"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "50%",
            textAlign: "center",
            fontSize: "10vw",
            fontWeight: "bold"
          }}
        >
          O<div style={{color: "white"}}>m</div>o<div style={{color: "white"}}>k</div> &nbsp; <div style={{color: "brown"}}>Online</div>
        </div>
        <div 
          id="button"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "50%",
          }}
        >
          <input 
            type="button" 
            value="Log In"
            onClick={this.props.tologin}
            style={{
              width: "20vw",
              height: "10vh",
              borderRadius: "50px",
              fontSize: "2.5vw",
              fontWeight: "bold",
              border: "2px solid white"
            }}
          />
        </div>
      </div>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div 
        id="login"
        style={{ 
          width: "100%",
          height: "100%"
        }}
      >
      </div>
    );
  }
}

class SignUp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div 
        id="signup"
        style={{ 
          width: "100%",
          height: "100%"
        }}
      >
      </div>
    );
  }
}

class Match extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title : "Matching" };

    this.match();
  }

  match() {
    this.iter = setInterval(() => {
      if(this.state.title == "Matching...") {
        this.setState({ title : "Matching" });
      
      } else {
        this.setState({ title : this.state.title + "." });
      }
    }, 300);

    socket = io.connect(window.location.href);

    socket.on("match", turn => {
      this.props.toboard(turn);
    });
  }

  render() {
    return (
      <div 
        id="match"
        style={{ 
          width: "100%",
          height: "100%"
        }}
      >
        <div 
          id="title"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            fontSize: "7vw",
            fontWeight: "bold"
          }}
        >
          {this.state.title}
        </div>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = { component : <Start tologin={this.match.bind(this)} /> };
  }

  start() {
    this.setState({ component : <Start tologin={this.match.bind(this)} /> });
  }

  login() {
    this.setState({ component : <Login /> });
  }

  signup() {
    this.setState({ component : <SignUp /> });
  }

  match() {
    this.setState({ component : <Match toboard={this.board.bind(this)} /> });
  }

  board(turn) {
    this.setState({ component : <Board turn={turn} tostart={this.start.bind(this)} /> });
  }

  render() {
    return (
      <div 
        id="background"
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          background: "#FFCC99"
        }}
      >
        {this.state.component}
      </div>
    );
  }
}

function App() {
  return (
    <Main />
  );
}

export default App;
