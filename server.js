
let express = require("express");
let socket = require("socket.io");
let http = require("http");
let app = express();

let server = http.createServer(app);
let io = socket(server);

let login = require("./route/login");
let Matcher = require("./route/match");
let Launcher = require("./route/launch");
let matcher = new Matcher(); 
let launcher = new Launcher();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(__dirname + "/front/build"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/front/public/index.html");
});

app.use("/login", login);

io.on("connection", sk => {
    sk.on("info", info => {
        matcher.add({
            "player" : JSON.parse(info),
            "sk" : sk
        });
    });

    sk.on("put", pos => {
        matcher.send(sk, {
            "name" : "put",
            "data" : pos
        });
    });

    sk.on("end", data => {
        let players = JSON.parse(data);

        matcher.delete(sk).map(p => {
            for(let i in players) {
                if(p.player.id == players[i].id) {
                    players[i].state == "win"? launcher.win(p.player) : launcher.lose(p.player);
                    
                    p.sk.emit("end", "");
                }
            }
        });
    });

    sk.on("win", info => {
        launcher.win(JSON.parse(info));

        sk.emit("end", "");
    });

    sk.on("disconnect", () => {
        if(matcher.find(sk) != -1) {
            matcher.delete(sk).map(p => {
                if(p.sk.id == sk.id) {
                    launcher.lose(p.player);
                }
                
                p.sk.emit("out", "");
            });
        
        } else {
            matcher.delete(sk);
        }
    });
});

server.listen(80, () => {
    console.log("server run");
});