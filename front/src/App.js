
// module
import React from "react";
import io from "socket.io-client";
import { isMobile } from "react-device-detect";

// component
import Board from "./board";
import BoardAI from "./board_ai";
import Start from "./start";
import Login from "./login";
import SignUp from "./signup";
import Match from "./match";
import Rank from "./rank";
import { gomokuMain, setGame, playerMove, turnNext, getBoard } from "./gomoku_ai";

// img
import OI from "./omok_img.PNG";

// mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ComputerIcon from '@mui/icons-material/Computer';
import Computer from "@mui/icons-material/Computer";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

let socket = io.connect(window.location.href);

class Main extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = { 
      p1 : "Player 1", 
      p2 : "Player 2",
      checked : [false, false, false]
    }
    this.ai_level = 0;
    this.pos = [-1, -1];
    this.is_call = false;
  }

  // start() {
  //   this.setState({ component : <Start is_mobile={isMobile} socket={socket} toplay={this.login.bind(this)} tomatch={this.match.bind(this)} torank={this.rank.bind(this)} toboardai={this.boardAI.bind(this)} /> });
  // }

  // login() {
  //   this.setState({ component : <Login is_mobile={isMobile} socket={socket} tostart={this.start.bind(this)} tosignup={this.signup.bind(this)} /> });
  // }

  // signup() {
  //   this.setState({ component : <SignUp is_mobile={isMobile} socket={socket} tostart={this.start.bind(this)} tologin={this.login.bind(this)} /> });
  // }

  // match() {
  //   this.setState({ component : <Match socket={socket} tostart={this.start.bind(this)} toboard={this.board.bind(this)} /> });
  // }

  // board(info) {
  //   this.setState({ component : <Board is_mobile={isMobile} socket={socket} info={info} tostart={this.start.bind(this)} /> });
  // }

  // boardAI(level) {
  //   console.log(level);

  //   this.setState({ component : <BoardAI ai_level={level} /> })
  // }

  // rank() {
  //   this.setState({ component : <Rank socket={socket} tostart={this.start.bind(this)} /> })
  // }

  componentDidMount() {
    if(this.is_call) return;

    this.is_call = true;

    let ins = document.createElement('ins');
    let scr = document.createElement('script');
  
    if(isMobile) {
      ins.className = 'kakao_ad_area';
      ins.style = "display:none;";
      scr.async = 'true';
      scr.type = "text/javascript";
      scr.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      ins.setAttribute('data-ad-width', '320');
      ins.setAttribute('data-ad-height', '50');
      ins.setAttribute('data-ad-unit', 'DAN-Ajp8GNB9LIblY0fv');
      
      document.querySelector('#ad').style.width = "320px";
      document.querySelector('#ad').appendChild(ins);
      document.querySelector('#ad').appendChild(scr);

    
    } else {
      ins.className = 'kakao_ad_area';
      ins.style = "display:none;";
      scr.async = 'true';
      scr.type = "text/javascript";
      scr.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      ins.setAttribute('data-ad-width', '728');
      ins.setAttribute('data-ad-height', '90');
      ins.setAttribute('data-ad-unit', 'DAN-BYO0zxbOJ7jSbM7s');
      
      document.querySelector('#ad').style.width = "728px";
      document.querySelector('#ad').appendChild(ins);
      document.querySelector('#ad').appendChild(scr);

      console.log("ad create!");
    }
  }

  set() {
    let board = [];

    for(let i=0; i<19; i++) {
      let line = [];

      for(let j=0; j<19; j++) {
        let background_color = "#FFCC99";

        line.push(
          <td 
            style={{
              background: background_color,
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
              border : "1px solid brown",
              borderCollapse : "collapse"
            }}
            key={`${i} ${j}`}
            id={`${i} ${j}`}
            onClick={this.click.bind(this)}
          >
            ⠀
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

  mark(x, y) {
    let [bx, by] = this.pos;
    let before_target = document.querySelector("td[id='" + `${bx} ${by}` + "']");
    let target = document.querySelector("td[id='" + `${x} ${y}` + "']");
    
    if(before_target != null) before_target.innerHTML = "⠀";
    if(target != null) target.innerHTML = "X";
    
    this.pos = [x, y];
  }

  click(e) {
    let target = e.currentTarget;
    let target_all = document.querySelectorAll("td");
    let [x, y] = target.id.split(" ").map(n => parseInt(n));
    
    if(getBoard()[x][y] != 0) return;

    playerMove(x, y);      
    target.style.backgroundColor = "black";
    this.mark(x, y);

    turnNext((xn, yn, state) => {
      let com_target = document.querySelector("td[id='" + `${xn} ${yn}` + "']");
      
      if(com_target != null) com_target.style.backgroundColor = "white";
      this.mark(xn, yn);

      if(state == 1) {
        alert("You win!")
        
        target_all.forEach(td => td.style.backgroundColor = "#FFCC99");
        gomokuMain("bla");
        setGame(this.ai_level);
        
      } else if(state == 2) {
        alert("Computer win!");
        
        target_all.forEach(td => td.style.backgroundColor = "#FFCC99");
        gomokuMain("bla");
        setGame(this.ai_level);
      
      } else if(state == 3) {
        alert("Draw!")
        
        target_all.forEach(td => td.style.backgroundColor = "#FFCC99");
        gomokuMain("bla");
        setGame(this.ai_level);
      }
    });
  }

  board() {
    return (
      <div
        id="body"
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
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
            {this.state.p1}
          </div>
        </div>
        <div 
          id="board"
          style={{
            width: "60%",
            height: "100%"
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
            {this.state.p2}
          </div>
        </div>
      </div>
    );
  }

  start() {
    return (
      <div
        id="start"
        style={{
          // display: "none"
        }}
      >
        <Stack 
          direction="row" 
          spacing={15}
        >
          <Button 
            variant="contained" 
            startIcon={<SportsEsportsIcon sx={{ width: "7vw", height: "4vw"}}/>}
            size="large"
            sx={{ width: "23vw", height: "13vh", fontSize: "2vw", fontWeight: "", justifyContent: 'flex-start' }}
            onClick={() => alert("추후 오픈")}
            // onClick={this.props.toplay}

          > 
            Online
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Computer sx={{ width: "7vw", height: "4vw"}}/>}
            size="large"
            sx={{ width: "23vw", height: "13vh", fontSize: "2vw", fontWeight: "", justifyContent: 'flex-start' }}
            onClick={(() => {
              document.querySelector("#start").style.display = "none";
              document.querySelector("#select").style.display = "flex";
            }).bind(this)}
          > 
            Computer
          </Button>
        </Stack>
      </div>
    );
  }

  handleCheckbox1(e) {
    this.state.checked = [true, false, false];

    this.setState(this.state);
  }

  handleCheckbox2(e) {
    this.state.checked = [false, true, false];
  
    this.setState(this.state);
  }

  handleCheckbox3(e) {
    this.state.checked = [false, false, true];

    this.setState(this.state);
  }

  handleComplay(e) {
    let stage = ["Easy", "Middle", "Hard"];
    let index = this.state.checked.indexOf(true);
    this.ai_level = index + 1;

    gomokuMain("bla"); // default
    setGame(this.ai_level); // 1 : easy, 2 : middle, 3 : hard

    document.querySelector("#overlay").style.display = "none";
    this.state.p1 = `Computer ${index + 1}`;
    this.state.p2 = "You";

    this.setState(this.state);
  } 

  select() {
    return (
      <div
        id="select"
        style={{
          display: "none",
          // display: "flex",
          background: "white",
          width: "20vw",
          height: "40vh",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "column"
        }}
      >
        <div 
          id="ai_title"
          style={{
            fontSize: "38px",
            fontWeight: "bold"
          }}
        >
          AI Level
        </div>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="AI Easy" checked={this.state.checked[0]} onChange={this.handleCheckbox1.bind(this)} />
          <FormControlLabel control={<Checkbox />} label="AI Middle" checked={this.state.checked[1]} onChange={this.handleCheckbox2.bind(this)} />
          <FormControlLabel control={<Checkbox />} label="AI Hard" checked={this.state.checked[2]} onChange={this.handleCheckbox3.bind(this)} />
        </FormGroup>
        <Button 
          variant="contained" 
          size="large"
          sx={{ width: "50%", height: "15%", textAlign: "center" }}
          onClick={this.handleComplay.bind(this)}
        > 
          Play
        </Button>
      </div>
    );
  }

  login() {
    return (
      <div
        id="login"
        style={{
          background: "white",
          width: "25vw",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "column"
        }}
      >
        <div
          id="login_title"
          style={{
            fontSize: "45px",
            fontWeight: "bold"
          }}
        >
          Login
        </div>
        <Stack 
          direction="column" 
          spacing={1}
          sx={{ width: "80%" }}
        >
          <TextField
            id="filled-required"
            label="ID"
            type="Search field"
            sx={{ width: "100%" }}
          />
          <TextField
            id="filled-required"
            label="PW"
            type="password"
            sx={{ width: "100%" }}
          />
          <div
            id="other"
            style={{
              width: "100%",
              textAlign: "center"
            }}
          >
            don't have account? <a href="/">Sign Up</a>
          </div>
        </Stack>
        <Button 
          variant="contained" 
          size="large"
          sx={{ width: "70%", height: "10%", textAlign: "center" }}
          onClick={() => alert("개발중...")}
        > 
          Login
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div 
        id="background"
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          backgroundSize: "100% 50px",
          // background: "#0A1929"
        }}
      >
        <div 
          id="overlay"
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          {/* {this.start()} */}
          {/* {this.select()} */}
          {this.login()}
        </div>
        <div
          style={{
            display: "block",
            width: "100%",
            height: "85%",
            // background: `url(${OI})`
          }}
        >
          {this.board()}
        </div>
        <div
          style={{
            display: "block",
            width: "100%",
            height: "15%",
            // background: `url(${OI})`
          }}
        >
          <div 
            id="ad"
            style={{
              margin: "0 auto",
              height: "100%",
            }}
          >
          </div>
        </div>
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
