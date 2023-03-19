
import React from "react";
import axios from "axios";

class Rank extends React.Component {
    constructor(props) {
      super(props);
  
      this.socket = this.props.socket;
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
  
    renderMobile() {
      return (
        <div 
          id="match"
          style={{ 
            width: "100vw",
            height: "100vh"
          }}
        >
          <div
            id="back"
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              top: "0",
              left: "0"
            }}
          >
            <input 
              type="button"
              value="<"
              onClick={this.props.tostart}
              style={{
                width: "100%",
                height: "100%",
                fontSize: "50px",
                color: "white",
                border: "1px solid brown",
                borderRadius: "50px",
                background: "brown",
                cursor: "pointer"
              }}
            />
          </div>
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

    render(d) {
      return (
        <div 
          id="match"
          style={{ 
            width: "100vw",
            height: "100vh"
          }}
        >
          <div
            id="back"
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              top: "0",
              left: "0"
            }}
          >
            <input 
              type="button"
              value="<"
              onClick={this.props.tostart}
              style={{
                width: "100%",
                height: "100%",
                fontSize: "50px",
                color: "white",
                border: "1px solid brown",
                borderRadius: "50px",
                background: "brown",
                cursor: "pointer"
              }}
            />
          </div>
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

export default Rank;