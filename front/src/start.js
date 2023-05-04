
import * as React from "react";
import axios from "axios";

// mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ComputerIcon from '@mui/icons-material/Computer';
import SearchIcon from '@mui/icons-material/Search';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

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
          <Stack direction="column" spacing={5}>
            <Button 
              variant="contained" 
              startIcon={<SportsEsportsIcon sx={{ width: "5vw", height: "5vh"}}/>}
              size="large"
              sx={{ width: "20vw", height: "10vh", fontSize: "1.5vw", fontWeight: "bolder", justifyContent: 'flex-start' }}
              onClick={this.props.toplay}
            > 
              Online
            </Button>
            <Button 
              variant="contained" 
              startIcon={<ComputerIcon sx={{ width: "5vw", height: "5vh"}} />} 
              size="large"
              sx={{ width: "20vw", height: "10vh", fontSize: "1.5vw", fontWeight: "bolder", justifyContent: 'flex-start' }}
              onClick={this.props.toboardai}
            >
              Computer
            </Button>
          </Stack>
          {/* <input 
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
          /> */}
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
              background: "rgba(251,75,2,1)",
              boxShadow: "-7px -7px 20px 0px rgba(255,255,255,.9),-4px -4px 5px 0px rgba(255,255,255,.9),7px 7px 20px 0px rgba(0,0,0,.2),4px 4px 5px 0px rgba(0,0,0,.3)",
              display: "block",
              width: "60vw",
              height: "17vh",
              borderRadius: "50px",
              fontSize: "8vw",
              fontWeight: "bold",
              marginBottom: "4vh",
              color: "white",
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
          {/* <input 
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
          /> */}
          <Stack direction="column" spacing={2}>
            <Button 
              variant="contained" 
              startIcon={<SearchIcon sx={{ width: "5vw", height: "5vh"}}/>}
              size="large"
              sx={{ width: "20vw", height: "10vh", fontSize: "1.5vw", fontWeight: "bolder", justifyContent: 'flex-start' }}
              onClick={this.props.tomatch}
            > 
              Match
            </Button>
            <Button 
              variant="contained" 
              startIcon={<MilitaryTechIcon sx={{ width: "5vw", height: "5vh"}} />} 
              size="large"
              sx={{ width: "20vw", height: "10vh", fontSize: "1.5vw", fontWeight: "bolder", justifyContent: 'flex-start' }}
              onClick={this.props.torank}
            >
              Rank
            </Button>
          </Stack>
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
                fontWeight: "bold",
                WebkitTextStroke: "2px black"
              }}
            >
              <div style={{color: "white"}}>O</div><div style={{color: "white"}}>m</div><div style={{color: "white"}}>o</div><div style={{color: "white"}}>k</div> &nbsp; <div style={{color: "orange"}}>Online</div>
            </div>
            {this.state.is_login? this.after() : this.before()}
          </div>
        );
      }
    }
}

export default Start;