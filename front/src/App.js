
// module
import React from "react";
import io from "socket.io-client";
import { isMobile } from "react-device-detect";

// component
import Board from "./board";
import Start from "./start";
import Login from "./login";
import SignUp from "./signup";
import Match from "./match";
import Rank from "./rank";

let socket = io.connect(window.location.href);

class Main extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = { component : <Start is_mobile={isMobile} socket={socket} toplay={this.login.bind(this)} tomatch={this.match.bind(this)} torank={this.rank.bind(this)} /> };
    // this.state = { component : <Rank /> }
  }

  start() {
    this.setState({ component : <Start is_mobile={isMobile} socket={socket} toplay={this.login.bind(this)} tomatch={this.match.bind(this)} torank={this.rank.bind(this)} /> });
  }

  login() {
    this.setState({ component : <Login is_mobile={isMobile} socket={socket} tostart={this.start.bind(this)} tosignup={this.signup.bind(this)} /> });
  }

  signup() {
    this.setState({ component : <SignUp is_mobile={isMobile} socket={socket} tostart={this.start.bind(this)} tologin={this.login.bind(this)} /> });
  }

  match() {
    this.setState({ component : <Match socket={socket} tostart={this.start.bind(this)} toboard={this.board.bind(this)} /> });
  }

  board(info) {
    this.setState({ component : <Board socket={socket} info={info} tostart={this.start.bind(this)} /> });
  }

  rank() {
    this.setState({ component : <Rank socket={socket} tostart={this.start.bind(this)} /> })
  }

  componentDidMount() {
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
    }
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
          background: "#FFCC99"
        }}
      >
        <div
          style={{
            display: "block",
            width: "100%",
            height: "85%",
            background: "#FFCC99"
          }}
        >
          {this.state.component}
        </div>
        <div
          style={{
            display: "block",
            width: "100%",
            height: "15%",
            background: "#FFCC99"
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
