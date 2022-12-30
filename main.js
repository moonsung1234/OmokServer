
// 렌주룰
class Omok {
    constructor() {
        this.board_size = [15, 15];
        this.board = [];
        this.space_c = '0';
        this.black_c = '1';
        this.white_c = '2';
        this.turn = this.black_c;
    }

    set() {
        for(let i=0; i<this.board_size[0]; i++) {
            this.board.push(this.space_c.repeat(this.board_size[1]).split(""));
        }
    }

    check_in_rule(x, y) {
        // 3-3

        // 4-4

        // 6목
    }

    check_end(x, y) {
        // 가로
        for(let i=y-4; i<=y; i++) {
            if((i < 0) || (i + 4 > this.board_size[1] - 1) || (this.board[x][i] == this.space_c)) continue;
            
            let target = this.board[x].slice(i, i + 5);

            if(target.filter(n => n == this.black_c).length == 5
            || target.filter(n => n == this.white_c).length == 5) {
                return true;
            }
        }

        // 세로
        for(let i=x-4; i<=x; i++) {
            if((i < 0) || (i + 4 > this.board_size[0] - 1) || (this.board[i][y] == this.space_c)) continue;
        
            let target = this.board.slice(i, i + 5).map(n => n[y]);

            if(target.filter(n => n == this.black_c).length == 5
            || target.filter(n => n == this.white_c).length == 5) {
                return true;
            }
        }

        // 오른쪽 대각선
        for(let [i, j] = [x-4, y+4]; i<=x && j>=y; [i++,  j--]) {
            if((i < 0) || (j > this.board_size[1] - 1) || (i + 4 > this.board_size[0] - 1) || (j - 4 < 0) || (this.board[i][j] == this.space_c)) continue;

            let target = this.board.slice(i, i + 5).map((n, idx) => n[j - idx]);

            if(target.filter(n => n == this.black_c).length == 5
            || target.filter(n => n == this.white_c).length == 5) {
                return true;
            }
        }

        // 왼쪽 대각선
        for(let [i, j] = [x-4, y-4]; i<=x && j<=y; [i++,  j++]) {
            if((i < 0) || (j < 0) || (i + 4 > this.board_size[0] - 1) || (j + 4 > this.board_size[1] - 1) || (this.board[i][j] == this.space_c)) continue;

            let target = this.board.slice(i, i + 5).map((n, idx) => n[j + idx]);

            if(target.filter(n => n == this.black_c).length == 5
            || target.filter(n => n == this.white_c).length == 5) {
                return true;
            }
        }

        return false;
    }

    put(x, y) {
        if(this.board[x][y] != this.space_c) return false;

        this.board[x][y] = this.turn;
        this.check_in_rule();

        if(this.check_end(x, y)) {
            console.log("Game over! win : " + this.turn);

            return;
        }

        this.turn = this.turn == this.black_c? this.white_c : this.black_c;

        this.print();
    }

    print() {
        let temp = "";

        for(let i in this.board) {
            temp += this.board[i].join("") + "\n";
        }

        console.log(temp);
    }
}

let omok = new Omok();
omok.set();
