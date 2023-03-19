
import React from "react";
import axios from "axios";

class Start extends React.Component {
    constructor(props) {
      super(props);
  
      this.is_mobile = this.props.is_mobile;
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
  
    // componentDidMount() {
    //   let ins = document.createElement('ins');
    //   let scr = document.createElement('script');
    
    //   ins.className = 'kakao_ad_area';
    //   ins.style = "display:none;";
    //   scr.async = 'true';
    //   scr.type = "text/javascript";
    //   scr.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    //   ins.setAttribute('data-ad-width', '320');
    //   ins.setAttribute('data-ad-height', '50');
    //   ins.setAttribute('data-ad-unit', 'DAN-Ajp8GNB9LIblY0fv');
    
    //   document.querySelector('#ad').appendChild(ins);
    //   document.querySelector('#ad').appendChild(scr);
    // }
  
    before() {
      return (
        <div 
          id="body"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            height: "60%",
          }}
        > 
          <input 
            type="button" 
            value="Play"
            onClick={this.props.toplay}
            style={{
              backgroundColor: "white",
              display: "block",
              width: "20vw",
              height: "20vh",
              borderRadius: "50px",
              fontSize: "3.5vw",
              fontWeight: "bold",
              border: "2px solid white",
              marginBottom: "4vh",
              cursor: "pointer"
            }}
          />
        </div>
      );
    }
  
    beforeMobile() {
      return (
        <div 
          id="body"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            height: "60%",
          }}
        > 
          <input 
            type="button" 
            value="Play"
            onClick={this.props.toplay}
            style={{
              backgroundColor: "white",
              display: "block",
              width: "60vw",
              height: "17vh",
              borderRadius: "50px",
              fontSize: "8vw",
              fontWeight: "bold",
              border: "2px solid white",
              marginBottom: "4vh",
              color: "black",
              cursor: "pointer"
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
            height: "60%",
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
              backgroundColor: "white",
              display: "block",
              width: "20vw",
              height: "10vh",
              borderRadius: "50px",
              fontSize: "2.5vw",
              fontWeight: "bold",
              color: "black",
              border: "2px solid white",
              marginBottom: "2vh",
              cursor: "pointer"
            }}
          />
          <input 
            type="button" 
            value="Rank"
            onClick={this.props.torank}
            style={{
              backgroundColor: "white",
              display: "block",
              width: "20vw",
              height: "10vh",
              borderRadius: "50px",
              fontSize: "2.5vw",
              fontWeight: "bold",
              color: "black",
              border: "2px solid white",
              cursor: "pointer"
            }}
          />
        </div>
      );
    }
  
    afterMobile() {
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
            height: "60%",
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
                fontSize: "8vw",
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
                fontSize: "7vw",
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
              backgroundColor: "white",
              display: "block",
              width: "60vw",
              height: "10vh",
              borderRadius: "50px",
              fontSize: "8vw",
              fontWeight: "bold",
              color: "black",
              border: "2px solid white",
              marginBottom: "2vh",
              cursor: "pointer"
            }}
          />
          <input 
            type="button" 
            value="Rank"
            onClick={this.props.torank}
            style={{
              backgroundColor: "white",
              display: "block",
              width: "60vw",
              height: "10vh",
              borderRadius: "50px",
              fontSize: "8vw",
              fontWeight: "bold",
              color: "black",
              border: "2px solid white",
              cursor: "pointer"
            }}
          />
        </div>
      );
    }

    // getAd() {
    //   return (
    //     <div 
    //       id="ad"
    //       style={{
    //         margin: "0 auto",
    //         width: "320px",
    //         height: "15%",
    //       }}
    //     >
    //     </div>
    //   )
    // }
  
    renderMobile() {
      return (
        <div 
          id="start"
          style={{ 
            width: "100vw",
            height: "100vh"
          }}
        >
          <div 
            id="title"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "40%",
              textAlign: "center",
              fontSize: "16vw",
              fontWeight: "bold"
            }}
          >
            O<div style={{color: "white"}}>m</div>o<div style={{color: "white"}}>k</div> &nbsp; <div style={{color: "brown"}}>Online</div>
          </div>
          {this.state.is_login? this.afterMobile() : this.beforeMobile()}
        </div>
      )
    }

    render() {
      if(this.is_mobile) {
        return this.renderMobile();
      
      } else {
        return (
          <div 
            id="start"
            style={{ 
              width: "100vw",
              height: "100vh"
            }}
          >
            <div 
              id="title"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "40%",
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
}

export default Start;