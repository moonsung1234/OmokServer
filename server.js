
let express = require("express");
let socket = require("socket.io");
let http = require("http");
let app = express();

let server = http.createServer(app);
let io = socket(server);

let players = [];

app.use("/", express.static(__dirname + "/front/build"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/front/public/index.html");
});

io.on("connection", (sk) => {
    console.log("connect : " + sk.id);

    if(players.length < 2) {
        players.push([sk.id, sk]);
        
        if(players.length == 2) {
            let [black, white] = ['1', '2'];
        
            players[0][1].emit("turn", black);
            players[1][1].emit("turn", white);
        }
    
    } else {
        sk.emit("full", "");
    }

    sk.on("put", pos => {
        sk.broadcast.emit("put", pos);
    });

    sk.on("end", () => {
        players.map(n => {
            n[1].emit("end", "");
        });

        players = [];
    });

    sk.on("disconnect", () => {
        console.log("disconnect : " + sk.id);

        let index = players.map(n => n[0]).indexOf(sk.id);

        if(index != -1)
            players.splice(index, 1);
    });
});

server.listen(80, () => {
    console.log("server run");
});