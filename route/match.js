
class Matcher {
    constructor() {
        this.matches = [];
        this.players = [];
    }

    add(info) {
        if(this.players.length != 0) {
            let match_player = this.players.shift();
            let [ black, white ] = ["1", "2"];
            let turn = [black, white][Math.floor(Math.random() * 2)];

            match_player.sk.emit("match", JSON.stringify({
                "player" : info.player,
                "turn" : turn
            }));

            info.sk.emit("match", JSON.stringify({
                "player" : match_player.player,
                "turn" : turn == black? white : black
            }));

            this.matches.push([info, match_player]);
        
        } else {
            this.players.push(info);
        }
    }

    find(sk) {
        for(let i in this.matches) {
            if(this.matches[i].map(n => n.sk.id).indexOf(sk.id) != -1) {
                return i;
            }
        }

        return -1;
    }

    send(sk, event) {
        let match_index = this.find(sk);

        if(match_index != -1) {
            let match_players = this.matches[match_index];

            match_players.map(player => {
                if(player.sk.id != sk.id) {
                    player.sk.emit(event.name, event.data);
                }
            });
        }
    }

    delete(sk) {
        let match_index = this.find(sk);
        let player_index = this.players.map(n => n.sk.id).indexOf(sk.id);

        if(match_index != -1) {
            return this.matches.splice(match_index, 1)[0];
        }

        if(player_index != -1) {
            return this.players.splice(player_index, 1);
        }

        return [];
    }
}

module.exports = Matcher;