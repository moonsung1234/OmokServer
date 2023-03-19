
import React from "react";
import axios from "axios";

class Login extends React.Component {
    constructor(props) {
      super(props);
  
      this.is_mobile = this.props.is_mobile;
      this.socket = this.props.socket;
      this.id = React.createRef();
      this.password = React.createRef();
    }
  
    componentDidMount() {
      window.document.addEventListener("keyup", e => {
        if(e.keyCode == 13) {
          this.login();
        }
      });
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

    signup(e) {
        this.props.tosignup();
    }
  
    renderMobile() {
      return (
        <div 
          id="login"
          style={{ 
            width: "100vw",
            height: "100vh"
          }}
        >
          <div
            id="back"
            style={{
              position: "absolute",
              width: "50px",
              height: "50px",
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
                fontSize: "20px",
                color: "white",
                border: "1px solid brown",
                borderRadius: "50px",
                background: "brown",
                cursor: "pointer"
              }}
            />
          </div>
          <div 
            id="title"
            style={{
              display: "block",
              fontSize: "13vw",
              fontWeight: "bold",
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
                width: "80vw",
                height: "7vh",
                borderRadius: "50px",
                fontSize: "5vw",
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
              type="password" 
              placeholder="password" 
              style={{
                display: "block",
                width: "80vw",
                height: "7vh",
                borderRadius: "50px",
                fontSize: "5vw",
                fontWeight: "bold",
                border: "2px solid white",
                padding: "10px"
              }}
            />
          </div>
          <div
            id="tosignup"
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "10px",
                paddingBottom: "20px",
                fontSize: "5vw",
            }}
          >
            don't sign up? 
            <a
                onClick={this.signup.bind(this)}
                style={{
                    textDecorationLine: "underline",
                    textDecorationColor: "blue",
                    color: "blue",
                    cursor: "pointer"
                }}
            > 
                sign up 
            </a> 
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
                backgroundColor: "skyblue",
                display: "block",
                width: "70vw",
                height: "8vh",
                borderRadius: "50px",
                fontSize: "5vw",
                fontWeight: "bold",
                color: "white",
                border: "2px solid skyblue",
                padding: "10px",
                cursor: "pointer"
              }}
              onClick={this.login.bind(this)}
            />
          </div>
        </div>
      );
    }

    render() {
      if(this.is_mobile) {
        return this.renderMobile();

      } else {
        return (
          <div 
            id="login"
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
                type="password" 
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
              id="tosignup"
              style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "10px",
                  paddingBottom: "20px",
                  fontSize: "1.5vw",
              }}
            >
              don't sign up? 
              <a
                  onClick={this.signup.bind(this)}
                  style={{
                      textDecorationLine: "underline",
                      textDecorationColor: "blue",
                      color: "blue",
                      cursor: "pointer"
                  }}
              > 
                  sign up 
              </a> 
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
                  padding: "10px",
                  cursor: "pointer"
                }}
                onClick={this.login.bind(this)}
              />
            </div>
          </div>
        );
      }
    }
}

export default Login;