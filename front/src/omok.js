
// 렌주룰
class Omok {
    constructor() {
        this.board_size = [15, 15];
        this.board = [];
        this.space_c = '0';
        this.black_c = '1';
        this.white_c = '2';
    }
    
    set() {
        this.board = [];
        this.turn = this.black_c;

        for(let i=0; i<this.board_size[0]; i++) {
            this.board.push(this.space_c.repeat(this.board_size[1]).split(""));
        }
    }

    check_3_3(x, y) {
        // 가로
        let count_h_3_3 = 0;

        for(let i=y-3; i<=y; i++) {
            if((i < 0) || (i + 3 > this.board_size[1] - 1) || (this.board[x][i] != this.turn)) continue;
            
            let target = this.board[x].slice(i, i + 4);

            if(target.filter(n => n == this.turn).length >= 3) {
                count_h_3_3++;
            }
        }

        // 세로
        let count_v_3_3 = 0;

        for(let i=x-3; i<=x; i++) {
            if((i < 0) || (i + 3 > this.board_size[0] - 1) || (this.board[i][y] != this.turn)) continue;
        
            let target = this.board.slice(i, i + 4).map(n => n[y]);

            if(target.filter(n => n == this.turn).length >= 3) {
                count_v_3_3++;
            }
        }

        // 오른쪽 대각선
        let count_rs_3_3 = 0;

        for(let [i, j] = [x-3, y+3]; i<=x && j>=y; [i++,  j--]) {
            if((i < 0) || (j > this.board_size[1] - 1) || (i + 3 > this.board_size[0] - 1) || (j - 3 < 0) || (this.board[i][j] != this.turn)) continue;

            let target = this.board.slice(i, i + 4).map((n, idx) => n[j - idx]);

            if(target.filter(n => n == this.turn).length >= 3) {
                count_rs_3_3++;
            }
        }

        // 왼쪽 대각선
        let count_ls_3_3 = 0;

        for(let [i, j] = [x-3, y-3]; i<=x && j<=y; [i++,  j++]) {
            if((i < 0) || (j < 0) || (i + 3 > this.board_size[0] - 1) || (j + 3 > this.board_size[1] - 1) || (this.board[i][j] != this.turn)) continue;

            let target = this.board.slice(i, i + 4).map((n, idx) => n[j + idx]);

            if(target.filter(n => n == this.turn).length >= 3) {
                count_ls_3_3++;
            }
        }

        let count_arr = [count_h_3_3, count_v_3_3, count_rs_3_3, count_ls_3_3];

        // console.log(count_arr);

        if(count_arr.filter(n => n == 0 || n == 1).length != 4) return false;
        if(count_arr.filter(n => n == 1).length >= 2) return true;

        return false;
    }

    check_4_4(x, y) {
        // 가로
        let count_h_4_4 = 0;

        for(let i=y-4; i<=y; i++) {
            if((i < 0) || (i + 4 > this.board_size[1] - 1) || (this.board[x][i] != this.turn)) continue;
            
            let target = this.board[x].slice(i, i + 5);

            if(target.filter(n => n == this.turn).length == 4) {
                count_h_4_4++;
            }
        }

        // 세로
        let count_v_4_4 = 0;

        for(let i=x-4; i<=x; i++) {
            if((i < 0) || (i + 4 > this.board_size[0] - 1) || (this.board[i][y] != this.turn)) continue;
        
            let target = this.board.slice(i, i + 5).map(n => n[y]);

            if(target.filter(n => n == this.turn).length == 4) {
                count_v_4_4++;
            }
        }

        // 오른쪽 대각선
        let count_rs_4_4 = 0;

        for(let [i, j] = [x-4, y+4]; i<=x && j>=y; [i++,  j--]) {
            if((i < 0) || (j > this.board_size[1] - 1) || (i + 4 > this.board_size[0] - 1) || (j - 4 < 0) || (this.board[i][j] != this.turn)) continue;

            let target = this.board.slice(i, i + 5).map((n, idx) => n[j - idx]);

            if(target.filter(n => n == this.turn).length == 4) {
                count_rs_4_4++;
            }
        }

        // 왼쪽 대각선
        let count_ls_4_4 = 0;

        for(let [i, j] = [x-4, y-4]; i<=x && j<=y; [i++,  j++]) {
            if((i < 0) || (j < 0) || (i + 4 > this.board_size[0] - 1) || (j + 4 > this.board_size[1] - 1) || (this.board[i][j] != this.turn)) continue;

            let target = this.board.slice(i, i + 4).map((n, idx) => n[j + idx]);

            if(target.filter(n => n == this.turn).length == 4) {
                count_ls_4_4++;
            }
        }

        let count_arr = [count_h_4_4, count_v_4_4, count_rs_4_4, count_ls_4_4];

        if(count_arr.filter(n => n == 1).length >= 1) console.log(count_arr);

        // if(count_arr.indexOf(2) != -1) return true;
        if(count_arr.filter(n => n == 1).length >= 2) return true;

        return false;
    }

    check_over_6(x, y) {
        // 가로
        for(let i=y-5; i<=y; i++) {
            if((i < 0) || (i + 5 > this.board_size[1] - 1) || (this.board[x][i] == this.space_c)) continue;
            
            let target = this.board[x].slice(i, i + 6);

            if(target.filter(n => n == this.turn).length == 6) {
                return true;
            }
        }

        // 세로
        for(let i=x-5; i<=x; i++) {
            if((i < 0) || (i + 5 > this.board_size[0] - 1) || (this.board[i][y] == this.space_c)) continue;
        
            let target = this.board.slice(i, i + 6).map(n => n[y]);

            if(target.filter(n => n == this.turn).length == 6) {
                return true;
            }
        }

        // 오른쪽 대각선
        for(let [i, j] = [x-5, y+5]; i<=x && j>=y; [i++,  j--]) {
            if((i < 0) || (j > this.board_size[1] - 1) || (i + 5 > this.board_size[0] - 1) || (j - 5 < 0) || (this.board[i][j] == this.space_c)) continue;

            let target = this.board.slice(i, i + 6).map((n, idx) => n[j - idx]);

            if(target.filter(n => n == this.turn).length == 6) {
                return true;
            }
        }

        // 왼쪽 대각선
        for(let [i, j] = [x-5, y-5]; i<=x && j<=y; [i++,  j++]) {
            if((i < 0) || (j < 0) || (i + 5 > this.board_size[0] - 1) || (j + 5 > this.board_size[1] - 1) || (this.board[i][j] == this.space_c)) continue;

            let target = this.board.slice(i, i + 6).map((n, idx) => n[j + idx]);

            if(target.filter(n => n == this.turn).length == 6) {
                return true;
            }
        }

        return false;
    }

    check_in_rule() {
        for(let i=0; i<this.board.length; i++) {
            for(let j=0; j<this.board[0].length; j++) {
                // 3-3
                if(this.check_3_3(i, j)) return false;
        
                // 4-4
                if(this.check_4_4(i, j)) return false;
        
                // 6목
                if(this.check_over_6(i, j)) return false;
            }
        }

        return true;
    }

    check_end(x, y) {
        // 가로
        for(let i=y-4; i<=y; i++) {
            if((i < 0) || (i + 4 > this.board_size[1] - 1) || (this.board[x][i] == this.space_c)) continue;
            
            let target = this.board[x].slice(i, i + 5);

            if(target.filter(n => n == this.turn).length == 5) {
                return true;
            }
        }

        // 세로
        for(let i=x-4; i<=x; i++) {
            if((i < 0) || (i + 4 > this.board_size[0] - 1) || (this.board[i][y] == this.space_c)) continue;
        
            let target = this.board.slice(i, i + 5).map(n => n[y]);

            if(target.filter(n => n == this.turn).length == 5) {
                return true;
            }
        }

        // 오른쪽 대각선
        for(let [i, j] = [x-4, y+4]; i<=x && j>=y; [i++,  j--]) {
            if((i < 0) || (j > this.board_size[1] - 1) || (i + 4 > this.board_size[0] - 1) || (j - 4 < 0) || (this.board[i][j] == this.space_c)) continue;

            let target = this.board.slice(i, i + 5).map((n, idx) => n[j - idx]);

            if(target.filter(n => n == this.turn).length == 5) {
                return true;
            }
        }

        // 왼쪽 대각선
        for(let [i, j] = [x-4, y-4]; i<=x && j<=y; [i++,  j++]) {
            if((i < 0) || (j < 0) || (i + 4 > this.board_size[0] - 1) || (j + 4 > this.board_size[1] - 1) || (this.board[i][j] == this.space_c)) continue;

            let target = this.board.slice(i, i + 5).map((n, idx) => n[j + idx]);

            if(target.filter(n => n == this.turn).length == 5) {
                return true;
            }
        }

        return false;
    }

    put(x, y) {
        if(this.board[x][y] != this.space_c) return false;

        this.board[x][y] = this.turn;

        if(this.check_end(x, y) && !this.check_over_6(x, y)) {
            console.log("Game over! win : " + this.turn);

            return true;
        }

        if(!this.check_in_rule()) {
            console.log("Wrong! try again");
            
            this.board[x][y] = this.space_c;

            return false;
        }

        this.turn = this.turn == this.black_c? this.white_c : this.black_c;
    }

    print() {
        let temp = "";

        for(let i in this.board) {
            temp += this.board[i].join("") + "\n";
        }

        console.log(temp);
    }
}

export default Omok;