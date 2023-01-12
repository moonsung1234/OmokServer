
let fs = require("fs");

class Launcher {
    constructor() {
        this.path = "C:/Users/muns3/OneDrive/Desktop/node-project/omok_server/data.json";
    }

    #load() {
        return fs.readFileSync(this.path);
    }

    #save(data) {
        fs.writeFileSync(this.path, data, "utf-8");
    }

    find(target) {
        let data = JSON.parse(this.#load());
    
        if(data[target.id] == undefined) return false;
        if(data[target.id].id != target.id || data[target.id].password != target.password) return false;

        return data[target.id];
    }

    save(target) {
        this.#save(JSON.stringify(target));
    }

    get() {
        return JSON.parse(this.#load());
    }

    win(target) {
        if(!this.find(target)) return false;

        let data = JSON.parse(this.#load());
        data[target.id]["win"] += 1;

        this.save(data);
    }

    lose(target) {
        if(!this.find(target)) return false;

        let data = JSON.parse(this.#load());
        data[target.id]["lose"] += 1;

        this.save(data);
    }
}

module.exports = Launcher;