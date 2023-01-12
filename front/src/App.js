
import React from "react";
import Omok from "./omok";
import axios from "axios";
import io from "socket.io-client";

let socket = null;

class Board extends React.Component {
  constructor(props) {
    super(props);
    
    this.omok = new Omok();
    this.omok.set();
    this.state = { 
      board : this.omok.get(), 
      pos : [-1, -1]
    };
    this.turn = this.props.info.turn;
    this.player = JSON.parse(window.sessionStorage.getItem("player"));

    socket.on("put", pos => {
      let [x, y] = pos;

      this.put(x, y);

      // alert("상대방이 뒀습니다.");
    });

    socket.on("out", () => {
      alert("상대방이 나갔습니다.");

      socket.emit("win", JSON.stringify(this.player));
    });

    socket.on("end", () => {
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
          <div 
            style={{ 
              display: "inline-block",
              width: "3vw",
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
            height: "3vw"
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
    
    socket.emit("end", JSON.stringify(data));
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

    socket.emit("put", [x, y]);
    
    this.put(x, y);
  }

  render() {
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
            marginLeft: "7.5vw"
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

class Start extends React.Component {
  constructor(props) {
    super(props);

    this.player = window.sessionStorage.getItem("player");
    this.state = { 
      is_login : this.player != null? true : false,
      win : 0,
      lose : 0
    };

    if(this.state.is_login) {
      let { id, password, win, lose } = JSON.parse(this.player);

      axios.post(window.location.href + "login", {
        id : id,
        password : password,
        category : "login"
      })
      .then(res => {
        let data = res.data;
        
        if(data.message == "success") {
          this.player = data.player;
  
          this.setState({
            is_login : this.state.is_login,
            win : this.player.win,
            lose : this.player.lose
          });
  
          window.sessionStorage.setItem("player", JSON.stringify(this.player));
  
        } else {
          alert(data.message);
        }
      });
    }
  }

  before() {
    return (
      <div 
        id="body"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "50%",
        }}
      > 
        <input 
          type="button" 
          value="Log In"
          onClick={this.props.tologin}
          style={{
            display: "block",
            width: "20vw",
            height: "10vh",
            borderRadius: "50px",
            fontSize: "2.5vw",
            fontWeight: "bold",
            border: "2px solid white",
            marginBottom: "4vh"
          }}
        />
        <input 
          type="button" 
          value="Sign Up"
          onClick={this.props.tosignup}
          style={{
            display: "block",
            width: "20vw",
            height: "10vh",
            borderRadius: "50px",
            fontSize: "2.5vw",
            fontWeight: "bold",
            border: "2px solid white"
          }}
        />
      </div>
    );
  }

  after() {
    this.player = typeof(this.player) == "string"? JSON.parse(this.player) : this.player;

    let { id, password, win, lose } = this.player;

    return (
      <div 
        id="body"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "50%",
        }}
      > 
        <div
          id="info"
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: "7vh",
            background: "#FFCC99"
          }}
        >
          <div 
            id="name"
            style={{
              display: "inline-block",
              fontSize: "3vw",
              marginBottom: "1vh",
              fontWeight: "bold",
              borderBottom: "5px solid brown"
            }}
          >
            {id}
          </div>
          &emsp;&emsp;&emsp;
          <div 
            id="score"
            style={{
              display: "inline-block",
              fontSize: "2.5vw",
              marginBottom: "1vh"
            }}
          >
            <p 
              style={{
                display: "inline", 
                color : "blue", 
                fontWeight: "bold"
              }}
            >
              {this.state.win}
            </p>
            승
            &nbsp;
            <p 
              style={{
                display: "inline", 
                color : "red", 
                fontWeight: "bold"
              }}
            >
              {this.state.lose}
            </p>
            패
          </div>
        </div>
        <input 
          type="button" 
          value="Match"
          onClick={this.props.tomatch}
          style={{
            display: "block",
            width: "20vw",
            height: "10vh",
            borderRadius: "50px",
            fontSize: "2.5vw",
            fontWeight: "bold",
            border: "2px solid white",
            marginBottom: "4vh"
          }}
        />
        <input 
          type="button" 
          value="Rank"
          onClick={this.props.torank}
          style={{
            display: "block",
            width: "20vw",
            height: "10vh",
            borderRadius: "50px",
            fontSize: "2.5vw",
            fontWeight: "bold",
            border: "2px solid white"
          }}
        />
      </div>
    );
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
        {this.state.is_login? this.after() : this.before()}
      </div>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.id = React.createRef();
    this.password = React.createRef();
  }

  login(e) {
    axios.post(window.location.href + "login", {
      id : this.id.current.value,
      password : this.password.current.value,
      category : "login"
    })
    .then(res => {
      let data = res.data;
      
      if(data.message == "success") {
        window.sessionStorage.setItem("player", JSON.stringify(data.player));

        this.props.tostart();
      
      } else {
        alert(data.message);
      }
    });
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
        <div 
          id="title"
          style={{
            display: "block",
            fontSize: "6vw",
            width: "100%",
            textAlign: "center",
            paddingTop: "80px",
            paddingBottom: "50px"
          }}
        >
          Log In
        </div>
        <div
          id="id"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "20px"
          }}
        >
          <input 
            ref={this.id}
            type="text" 
            placeholder="id"
            style={{
              display: "block",
              width: "20vw",
              height: "3vh",
              borderRadius: "50px",
              fontSize: "1.5vw",
              fontWeight: "bold",
              border: "2px solid white",
              padding: "10px"
            }}
          />
        </div>
        <div
          id="password"
          style={{
            width: "",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "20px"
          }}
        >
          <input  
            ref={this.password}
            type="text" 
            placeholder="password" 
            style={{
              display: "block",
              width: "20vw",
              height: "3vh",
              borderRadius: "50px",
              fontSize: "1.5vw",
              fontWeight: "bold",
              border: "2px solid white",
              padding: "10px"
            }}
          />
        </div>
        <div
          id="submit"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "10px",
            paddingBottom: "20px"
          }}
        >
          <input 
            type="button"
            value="login"
            style={{
              display: "block",
              width: "10vw",
              height: "8vh",
              borderRadius: "50px",
              fontSize: "2vw",
              fontWeight: "bold",
              border: "2px solid white",
              padding: "10px"
            }}
            onClick={this.login.bind(this)}
          />
        </div>
      </div>
    );
  }
}

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.id = React.createRef();
    this.password = React.createRef();
  }

  signup(e) {
    axios.post(window.location.href + "login", {
      id : this.id.current.value,
      password : this.password.current.value,
      category : "signup"
    })
    .then(res => {
      let data = res.data;
      
      if(data.message == "success") {
        this.props.tostart();
      
      } else {
        alert(data.message);
      }
    });
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
        <div 
          id="title"
          style={{
            display: "block",
            fontSize: "6vw",
            width: "100%",
            textAlign: "center",
            paddingTop: "80px",
            paddingBottom: "50px"
          }}
        >
          Sign Up
        </div>
        <div
          id="id"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "20px"
          }}
        >
          <input 
            ref={this.id}
            type="text" 
            placeholder="id"
            style={{
              display: "block",
              width: "20vw",
              height: "3vh",
              borderRadius: "50px",
              fontSize: "1.5vw",
              fontWeight: "bold",
              border: "2px solid white",
              padding: "10px"
            }}
          />
        </div>
        <div
          id="password"
          style={{
            width: "",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "20px"
          }}
        >
          <input  
            ref={this.password}
            type="text" 
            placeholder="password" 
            style={{
              display: "block",
              width: "20vw",
              height: "3vh",
              borderRadius: "50px",
              fontSize: "1.5vw",
              fontWeight: "bold",
              border: "2px solid white",
              padding: "10px"
            }}
          />
        </div>
        <div
          id="submit"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "10px",
            paddingBottom: "20px"
          }}
        >
          <input 
            type="button"
            value="signup"
            style={{
              display: "block",
              width: "10vw",
              height: "8vh",
              borderRadius: "50px",
              fontSize: "2vw",
              fontWeight: "bold",
              border: "2px solid white",
              padding: "10px"
            }}
            onClick={this.signup.bind(this)}
          />
        </div>
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
    
    socket.on("match", info => {
      this.props.toboard(JSON.parse(info));
    });
    
    socket.emit("info", window.sessionStorage.getItem("player"));
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

class Rank extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players : []
    }

    axios.get(window.location.href + "login/every")
    .then(res => {
      let data = res.data;
      
      if(data.message == "success") {
        let players = Object.values(data.players).sort((a, b) => {
            return (b.win * 2 - b.lose) - (a.win * 2 - a.lose) 
        });

        this.setState({ players : players.splice(0, 3) });
      
      } else {
        alert(data.message);
      }
    });
  }

  render(d) {
    return (
      <div 
        id="match"
        style={{ 
          width: "100%",
          height: "100%"
        }}
      >
        <div
          id="info"
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: "3vh",
            background: "#FFCC99"
          }}
        >
          <div 
            id="number"
            style={{
              display: "inline-block",
              fontSize: "4vw",
              marginTop: "3vh",
              marginBottom: "1vh",
              fontWeight: "bold",
              color: "yellow"
            }}
          >
            1. 
          </div>
          &emsp;&emsp;&emsp;
          <div 
            id="name"
            style={{
              display: "inline-block",
              fontSize: "3vw",
              marginTop: "3vh",
              marginBottom: "1vh",
              fontWeight: "bold",
            }}
          >
            {this.state.players.length == 0? "ㅡ" : this.state.players[0].id}
          </div>
          &emsp;&emsp;&emsp;
          <div 
            id="score"
            style={{
              display: "inline-block",
              fontSize: "2.5vw",
              marginTop: "3vh",
              marginBottom: "1vh"
            }}
          >
            <p 
              style={{
                display: "inline", 
                color : "blue", 
                fontWeight: "bold"
              }}
            >
              {this.state.players.length == 0? 0 : this.state.players[0].win}
            </p>
            승
            &nbsp;
            <p 
              style={{
                display: "inline", 
                color : "red", 
                fontWeight: "bold"
              }}
            >
              {this.state.players.length == 0? 0 : this.state.players[0].lose}
            </p>
            패
          </div>
        </div>
        <div
          id="info"
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "3vh",
            marginBottom: "3vh",
            background: "#FFCC99"
          }}
        >
          <div 
            id="number"
            style={{
              display: "inline-block",
              fontSize: "4vw",
              marginTop: "3vh",
              marginBottom: "1vh",
              fontWeight: "bold",
              color: "silver"
            }}
          >
            2. 
          </div>
          &emsp;&emsp;&emsp;
          <div 
            id="name"
            style={{
              display: "inline-block",
              fontSize: "3vw",
              marginBottom: "1vh",
              fontWeight: "bold",
            }}
          >
            {this.state.players.length == 0? "ㅡ" : this.state.players[1].id}
          </div>
          &emsp;&emsp;&emsp;
          <div 
            id="score"
            style={{
              display: "inline-block",
              fontSize: "2.5vw",
              marginBottom: "1vh"
            }}
          >
            <p 
              style={{
                display: "inline", 
                color : "blue", 
                fontWeight: "bold"
              }}
            >
              {this.state.players.length == 0? 0 : this.state.players[1].win}
            </p>
            승
            &nbsp;
            <p 
              style={{
                display: "inline", 
                color : "red", 
                fontWeight: "bold"
              }}
            >
              {this.state.players.length == 0? 0 : this.state.players[1].lose}
            </p>
            패
          </div>
        </div>
        <div
          id="info"
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "3vh",
            marginBottom: "3vh",
            background: "#FFCC99"
          }}
        >
          <div 
            id="number"
            style={{
              display: "inline-block",
              fontSize: "4vw",
              marginTop: "3vh",
              marginBottom: "1vh",
              color: "brown",
              fontWeight: "bold"
            }}
          >
            3. 
          </div>
          &emsp;&emsp;&emsp;
          <div 
            id="name"
            style={{
              display: "inline-block",
              fontSize: "3vw",
              marginBottom: "1vh",
              fontWeight: "bold",
            }}
          >
            {this.state.players.length == 0? "ㅡ" : this.state.players[2].id}
          </div>
          &emsp;&emsp;&emsp;
          <div 
            id="score"
            style={{
              display: "inline-block",
              fontSize: "2.5vw",
              marginBottom: "1vh"
            }}
          >
            <p 
              style={{
                display: "inline", 
                color : "blue", 
                fontWeight: "bold"
              }}
            >
              {this.state.players.length == 0? 0 : this.state.players[2].win}
            </p>
            승
            &nbsp;
            <p 
              style={{
                display: "inline", 
                color : "red", 
                fontWeight: "bold"
              }}
            >
              {this.state.players.length == 0? 0 : this.state.players[2].lose}
            </p>
            패
          </div>
        </div>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = { component : <Start tologin={this.login.bind(this)} tosignup={this.signup.bind(this)} tomatch={this.match.bind(this)} torank={this.rank.bind(this)} /> };
    // this.state = { component : <Rank /> }
  }

  start() {
    this.setState({ component : <Start tologin={this.login.bind(this)} tosignup={this.signup.bind(this)} tomatch={this.match.bind(this)} torank={this.rank.bind(this)} /> });
  }

  login() {
    this.setState({ component : <Login tostart={this.start.bind(this)} /> });
  }

  signup() {
    this.setState({ component : <SignUp tostart={this.start.bind(this)} /> });
  }

  match() {
    this.setState({ component : <Match toboard={this.board.bind(this)} /> });
  }

  board(info) {
    this.setState({ component : <Board info={info} tostart={this.start.bind(this)} /> });
  }

  rank() {
    this.setState({ component : <Rank /> })
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
