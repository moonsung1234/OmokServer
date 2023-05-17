
// module
import React, { createRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { isMobile } from "react-device-detect";
import Omok from "./omok";

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

// let socket = io.connect(window.location.href);

class Main extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      p1 : "Player 1",
      p2 : "Player 2",
      checked : [false, false, false]
    }
    this.socket = io.connect(window.location.href);;
    this.ai_level = 0;
    this.pos = [-1, -1];
    this.is_call = false;
    this.is_match = false;
    this.login_id = createRef();
    this.login_pw = createRef();
    this.signup_id = createRef();
    this.signup_pw = createRef();

    this.socket.on("match", info => {
      let parsed_info = JSON.parse(info);

      this.omok = new Omok();
      this.omok.set();

      this.turn = parsed_info.turn;
      this.is_match = true;
      this.player = JSON.parse(window.sessionStorage.getItem("player"));
      
      this.state.p1 = this.turn == this.omok.white_c? this.player.id : parsed_info.player.id;
      this.state.p2 = this.turn == this.omok.black_c? this.player.id : parsed_info.player.id;

      this.show({});
      this.setState(this.state);
    });

    this.socket.on("put", pos => {
      let [x, y] = pos;

      this.put(x, y);
    });

    this.socket.on("out", () => {
      // this.socket.emit("win", JSON.stringify(this.player));
      alert("상대방이 나갔습니다.");
    
      let target_all = document.querySelectorAll("td");

      this.omok.set();
      this.state.p1 = "Player 1";
      this.state.p2 = "Player 2";
      target_all.forEach(td => {
        td.style.backgroundColor = "#FFCC99"
        td.innerHTML = "⠀"
      });
      
      this.is_match = false;
      this.show({ overlay : true, start : true });
    });

    this.socket.on("end", () => {
      this.omok.set();
      this.show({ overlay : true, start : true });
    });
  }

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
    let turn = this.omok.turn;
    let result = this.omok.put(x, y);
    let target = document.querySelector("td[id='" + `${x} ${y}` + "']");
    let target_all = document.querySelectorAll("td");
    
    if(result == false) {
      alert("렌주룰 규칙에 귀반되는 위치입니다.");

       return;
    }

    target.style.background = turn == this.omok.black_c? "black" : "white";
    this.mark(x, y);

    if(result) {
      alert((turn == this.omok.black_c? "black" : "white") + " win!");
      
      this.omok.set();
      this.state.p1 = "Player 1";
      this.state.p2 = "Player 2";
      target_all.forEach(td => {
        td.style.backgroundColor = "#FFCC99"
        td.innerHTML = "⠀"
      });
      
      this.is_match = false;
      this.show({ overlay : true, start : true });
    }
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
    
    if(this.is_match) {
      if(this.turn != this.omok.turn) return;
  
      this.socket.emit("put", [x, y]);    
      this.put(x, y);

    } else {
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
          this.show({ overlay : true, start : true });
          
        } else if(state == 2) {
          alert("Computer win!");
          
          target_all.forEach(td => td.style.backgroundColor = "#FFCC99");
          this.show({ overlay : true, start : true });
        
        } else if(state == 3) {
          alert("Draw!")
          
          target_all.forEach(td => td.style.backgroundColor = "#FFCC99");
          this.show({ overlay : true, start : true });
        }
      });
    }

  }

  board() {
    return (
      <div
        id="board"
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
          display: "block"
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
            onClick={(() => {
              let player = window.sessionStorage.getItem("player");

              if(player != null) {
                this.show({ match : true });

                let iter = setInterval(() => {
                  if(this.is_match) clearInterval(iter); 

                  let title = document.querySelector("#match");
    
                  if(title.innerHTML == "Matching...") {
                    title.innerHTML = "Matching";
                  
                  } else {
                    title.innerHTML = title.innerText + ".";
                  }
                }, 200);
                
                this.socket.emit("info", window.sessionStorage.getItem("player"));

              } else {
                this.show({ overlay : true, login : true });
              }
            }).bind(this)}
            // onClick={this.props.toplay}

          > 
            Online
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Computer sx={{ width: "7vw", height: "4vw"}}/>}
            size="large"
            sx={{ width: "23vw", height: "13vh", fontSize: "2vw", fontWeight: "", justifyContent: 'flex-start' }}
            onClick={(() => this.show({ overlay : true, select : true })).bind(this)}
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

  checkForm(id, password) {
    let reg_exp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    let n_password = password.replace(/[0-9]/g, "");
    let a_password = password.replace(/[a-z]/g, "");
    let na_password = password.replace(/[0-9a-z]/g, "");

    // id check
    if(id.length < 2 || id.length > 10) {
      alert("id 길이가 너무 짧거나 깁니다. id는 2자 이상 10자 이하여야 합니다.");
      
      return;
      
    } else if(id.indexOf(" ") != -1 || id.match(reg_exp) != null) {
      alert("id 형식이 잘못되었습니다. 특수문자나 공백을 제거해 주세요.");
    
      return;
    }

    // password check
    if(password.length < 5 || password.length > 10) {
      alert("password 길이가 너무 짧거나 깁니다. password는 5자 이상 10자 이하여야 합니다.");

      return;
    
    } else if(n_password == password || a_password == password || na_password != "") {
      alert("password 형식이 잘못되었습니다. password는 숫자와 알파펫이 둘 다 존재하는 형태여야 합니다.");
    
      return;
    }

    axios.post(window.location.href + "login", {
      id : id,
      password : password,
      category : "signup"
    })
    .then(res => {
      let data = res.data;
      
      if(data.message == "success") {
        alert("회원가입 성공!");
        this.show({ overlay : true, login : true });
      
      } else {
        alert(data.message);
      }
    });
  }

  send(id, password) {
    axios.post(window.location.href + "login", {
      id : id,
      password : password,
      category : "login"
    })
    .then(res => {
      let data = res.data;
      
      if(data.message == "success") {
        window.sessionStorage.setItem("player", JSON.stringify(data.player));

        alert("로그인 성공!");
        this.show({ overlay : true, start : true });

      } else {
        alert(data.message);
      }
    });
  }

  signup() {
    return (
      <div
        id="signup"
        style={{
          background: "white",
          width: "25vw",
          height: "60vh",
          display: "none",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "column"
        }}
      >
        <div
          id="signup_title"
          style={{
            fontSize: "45px",
            fontWeight: "bold"
          }}
        >
          Sign Up
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
            inputRef={this.signup_id}
            sx={{ width: "100%" }}
          />
          <TextField
            id="filled-required"
            label="PW"
            type="password"
            inputRef={this.signup_pw}
            sx={{ width: "100%" }}
          />
          <div
            id="other"
            style={{
              width: "100%",
              textAlign: "center"
            }}
          >
            already sign up? 
            <a 
              style={{ textDecoration: "underline", cursor: "pointer" }} 
              onClick={() => this.show({ overlay : true, login : true })}
            >
              Login
            </a>
          </div>
        </Stack>
        <Button 
          variant="contained" 
          size="large"
          sx={{ width: "70%", height: "10%", textAlign: "center" }}
          onClick={(() => {
            this.checkForm(this.signup_id.current.value, this.signup_pw.current.value);
          }).bind(this)}
        > 
          Sign Up
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
          display: "none",
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
            inputRef={this.login_id}
            sx={{ width: "100%" }}
          />
          <TextField
            id="filled-required"
            label="PW"
            type="password"
            inputRef={this.login_pw}
            sx={{ width: "100%" }}
          />
          <div
            id="other"
            style={{
              width: "100%",
              textAlign: "center"
            }}
          >
            don't have account? 
            <a 
              style={{ textDecoration: "underline", cursor: "pointer" }} 
              onClick={(() => this.show({ overlay : true, signup : true })).bind(this)}
            >
              Sign Up
            </a>
          </div>
        </Stack>
        <Button 
          variant="contained" 
          size="large"
          sx={{ width: "70%", height: "10%", textAlign: "center" }}
          onClick={(() => this.send(this.login_id.current.value, this.login_pw.current.value)).bind(this)}
        > 
          Login
        </Button>
      </div>
    );
  }

  show({ overlay=false, match=false, start=false, select=false, login=false, signup=false }) {
    let overlay_component = document.querySelector("#overlay");
    let match_component =document.querySelector("#match");
    let start_component = document.querySelector("#start");
    let select_component = document.querySelector("#select");
    let login_component = document.querySelector("#login");
    let signup_component = document.querySelector("#signup");

    overlay_component.style.display = overlay? "flex" : "none";
    match_component.style.display = match? "flex" : "none";
    start_component.style.display = start? "block" : "none";
    select_component.style.display = select? "flex" : "none";
    login_component.style.display = login? "flex" : "none";
    signup_component.style.display = signup? "flex" : "none";
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
          {this.start()}
          {this.select()}
          {this.login()}
          {this.signup()}
        </div>
        <div
          id="match"
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            background: "rgba(0, 0, 0, 0.5)",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "70px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Matching...
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
