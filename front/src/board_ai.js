
import React from "react";
import axios from "axios";
import Omok from "./omok";
import { gomokuMain, setGame, playerMove, turnNext, getBoard } from "./gomoku_ai";

class Board extends React.Component {
    constructor(props) {
      super(props);

      this.pos = [-1, -1];
      this.ai_level = prompt("ai 단계를 설정해주세요. (1 : easy, 2 : middle, 3 : hard)");

      if(["1", "2", "3"].indexOf(this.ai_level) == -1) this.ai_level = 1;

      this.ai_level = parseInt(this.ai_level);

      console.log(this.ai_level);

      gomokuMain("bla"); // default
      setGame(this.ai_level); // 1 : easy, 2 : middle, 3 : hard
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
      let target = e.target
      let target_all = document.querySelectorAll("td");
      let [x, y] = target.id.split(" ").map(n => parseInt(n));
      
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
    //   if(this.is_mobile) {
    //     return this.renderMobile();

    //   } else {
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
                        Computer
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
                        You
                    </div>
                </div>
            </div>
        );
    //   }
    }
}

export default Board;