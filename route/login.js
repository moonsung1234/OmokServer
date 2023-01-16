
let express = require("express");
let Launcher = require("./launch");

let router = express.Router();
let launcher = new Launcher();

router.post("/", (req, res) => {
    let { id, password, category } = req.body;
    let player = {
        id : id,
        password : password,
        win : 0,
        lose : 0
    }
    let saved_player = launcher.find(player);

    if(category == "signup") {
        if(!saved_player) {
            launcher.save(player);

            res.send(JSON.stringify({
                message : "success"
            }));
        
        } else {
            res.send(JSON.stringify({ 
                message : "Already Exist"
            }));
        }
    
    } else if(category == "login") {
        if(saved_player) {
            res.send(JSON.stringify({
                message : "success",
                player : saved_player
            }));
        
        } else {
            res.send(JSON.stringify({ 
                message : "Wrong or Not Exist"
            }));
        }
    }
});

router.get("/every", (req, res) => {
    let data = launcher.get();

    res.send(JSON.stringify({
        message : "success",
        players : data
    }));
});

module.exports = router;