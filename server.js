
let express = require("express");
let socket = require("socket.io");
let http = require("http");
let app = express();

let server = http.createServer(app);
let io = socket(server);

class Matcher {
    constructor() {
        this.matches = [];
        this.players = [];
    }

    add(sk) {
        if(this.players.length != 0) {
            let match_player = this.players.shift();
            let turn = ["1", "2"][Math.floor(Math.random() * 2)];

            match_player.emit("match", turn);
            sk.emit("match", turn == "1"? "2" : "1");

            this.matches.push([sk, match_player]);
        
        } else {
            this.players.push(sk);
        }
    }

    find(sk) {
        for(let i in this.matches) {
            if(this.matches.map(n => n.id).indexOf(sk.id) != -1) {
                return i;
            }
        }

        return -1;
    }

    delete(sk) {
        let match_index = this.find(sk);
        let player_index = this.players.map(n => n.id).indexOf(sk.id);

        if(match_index != -1) {
            this.matches.splice(match_index, 1);
        }

        if(player_index != -1) {
            this.players.splice(player_index, 1);
        }
    }
}

let matcher = new Matcher();

app.use("/", express.static(__dirname + "/front/build"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/front/public/index.html");
});

io.on("connection", (sk) => {
    console.log("connect : " + sk.id);

    matcher.add(sk);

    sk.on("put", pos => {
        sk.broadcast.emit("put", pos);
    });

    sk.on("end", () => {
        matcher.delete(sk);
    });

    sk.on("disconnect", () => {
        console.log("disconnect : " + sk.id);

        matcher.delete(sk);
    });
});

server.listen(80, () => {
    console.log("server run");
});