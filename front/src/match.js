
import React from "react";

class Match extends React.Component {
    constructor(props) {
        super(props);

        this.socket = this.props.socket;
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
      
      this.socket.on("match", info => {
        this.props.toboard(JSON.parse(info));
      });
      
      this.socket.emit("info", window.sessionStorage.getItem("player"));
    }
  
    render() {
      return (
        <div 
          id="match"
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

export default Match;