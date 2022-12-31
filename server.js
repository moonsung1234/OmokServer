
let express = require("express");
let app = express();

app.use("/", express.static(__dirname + "/front/build"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/front/public/index.html");
});

app.listen(80, () => {
    console.log("server run");
});