
import React from "react";
import axios from "axios";

class SignUp extends React.Component {
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
          this.signup();
        }
      });
    }

    signup(e) {
      let [id, password] = [this.id.current.value, this.password.current.value];
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
          this.props.tostart();
        
        } else {
          alert(data.message);
        }
      });
    }
  
    login(e) {
        this.props.tologin();
    }

    renderMobile() {
      return (
        <div 
          id="signup"
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
            id="tologin"
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
            do you want to login?
            <a
                onClick={this.login.bind(this)}
                style={{
                    textDecorationLine: "underline",
                    textDecorationColor: "blue",
                    color: "blue",
                    cursor: "pointer"
                }}
            > 
                login 
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
              value="signup"
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
              onClick={this.signup.bind(this)}
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
            id="signup"
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
              id="tologin"
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
              do you want to login? 
              <a
                  onClick={this.login.bind(this)}
                  style={{
                      textDecorationLine: "underline",
                      textDecorationColor: "blue",
                      color: "blue",
                      cursor: "pointer"
                  }}
              > 
                  login
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
                value="signup"
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
                onClick={this.signup.bind(this)}
              />
            </div>
          </div>
        );
      }
    }
}

export default SignUp;
