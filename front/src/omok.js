
// 렌주룰
class Omok {
    constructor() {
        this.board_size = [17, 17];
        this.board = [];
        this.space_c = '0';
        this.black_c = '1';
        this.white_c = '2';
        this.border_c = '3';
    }
    
    set() {
        this.board = [];
        this.turn = this.black_c;

        this.board.push(this.border_c.repeat(this.board_size[1]).split(""));

        for(let i=0; i<this.board_size[0]-2; i++) {
            let line = this.space_c.repeat(this.board_size[1] - 2).split("");
            
            line.unshift(this.border_c);
            line.push(this.border_c);

            this.board.push(line);
        }

        this.board.push(this.border_c.repeat(this.board_size[1]).split(""));
    }

    get() {
        let temp = [];

        for(let i=1; i<this.board_size[0]-1; i++) {
            let line = this.board[i];
            let temp_line = this.space_c.repeat(this.board_size[1] - 2).split("");

            for(let j=0; j<temp_line.length; j++) {
                temp_line[j] = line[j + 1]
            }

            temp.push(temp_line);
        }

        return temp;
    }

    compare(arr1, arr2) {
        for(let idx in arr1) {
            if(arr1[idx] != arr2[idx]) return false;
        }

        return true;
    }

    get_open_3() {
        let other = this.turn == this.white_c? this.black_c : this.white_c;

        return [
            [this.space_c, this.space_c, this.turn, this.turn, this.turn, this.space_c, this.space_c],
            [this.space_c, this.space_c, this.turn, this.turn, this.space_c, this.turn, this.space_c, this.space_c],
            [this.space_c, this.space_c, this.turn, this.space_c, this.turn, this.turn, this.space_c, this.space_c],
            [other, this.space_c, this.turn, this.turn, this.turn, this.space_c, this.space_c],
            [other, this.space_c, this.turn, this.turn, this.space_c, this.turn, this.space_c, this.space_c],
            [other, this.space_c, this.turn, this.space_c, this.turn, this.turn, this.space_c, this.space_c],
            [this.border_c, this.space_c, this.turn, this.turn, this.turn, this.space_c, this.space_c],
            [this.border_c, this.space_c, this.turn, this.turn, this.space_c, this.turn, this.space_c, this.space_c],
            [this.border_c, this.space_c, this.turn, this.space_c, this.turn, this.turn, this.space_c, this.space_c],
            [this.space_c, this.space_c, this.turn, this.turn, this.turn, this.space_c, this.border_c],
            [this.space_c, this.space_c, this.turn, this.turn, this.space_c, this.turn, this.space_c, this.border_c],
            [this.space_c, this.space_c, this.turn, this.space_c, this.turn, this.turn, this.space_c, this.border_c],
            [this.space_c, this.space_c, this.turn, this.turn, this.turn, this.space_c, other],
            [this.space_c, this.space_c, this.turn, this.turn, this.space_c, this.turn, this.space_c, other],
            [this.space_c, this.space_c, this.turn, this.space_c, this.turn, this.turn, this.space_c, other]
        ];
    }

    get_open_4() {
        let other = this.turn == this.white_c? this.black_c : this.white_c;

        return [
            [this.space_c, this.turn, this.turn, this.turn, this.turn, this.space_c],
            [this.space_c, this.turn, this.space_c, this.turn, this.turn, this.turn, this.space],
            [this.space_c, this.turn, this.turn, this.space_c, this.turn, this.turn, this.space],
            [this.space_c, this.turn, this.turn, this.turn, this.space_c, this.turn, this.space],
            [this.turn, this.turn, this.turn, this.turn, this.space_c],
            [this.turn, this.space_c, this.turn, this.turn, this.turn, this.space],
            [this.turn, this.turn, this.space_c, this.turn, this.turn, this.space],
            [this.turn, this.turn, this.turn, this.space_c, this.turn, this.space],
            [this.space_c, this.turn, this.turn, this.turn, this.turn],
            [this.space_c, this.turn, this.space_c, this.turn, this.turn, this.turn],
            [this.space_c, this.turn, this.turn, this.space_c, this.turn, this.turn],
            [this.space_c, this.turn, this.turn, this.turn, this.space_c, this.turn],
            [other, this.turn, this.turn, this.turn, this.turn, this.space_c],
            [other, this.turn, this.space_c, this.turn, this.turn, this.turn, this.space],
            [other, this.turn, this.turn, this.space_c, this.turn, this.turn, this.space],
            [other, this.turn, this.turn, this.turn, this.space_c, this.turn, this.space],
            [this.space_c, this.turn, this.turn, this.turn, this.turn, other],
            [this.space_c, this.turn, this.space_c, this.turn, this.turn, this.turn, other],
            [this.space_c, this.turn, this.turn, this.space_c, this.turn, this.turn, other],
            [this.space_c, this.turn, this.turn, this.turn, this.space_c, this.turn, other]
        ];
    }

    check_3_3_h(x, y) {
        let open_3 = this.get_open_3();
        
        for(let i in open_3) {
            for(let j=y-open_3[i].length+1; j<=y; j++) {
                if((j < 0) || (j + open_3[i].length - 1 > this.board_size[1] - 1)) continue;

                let target = this.board[x].slice(j, j + open_3[i].length);
    
                if(this.compare(target, open_3[i])) {
                    return [x, j, open_3[i]];
                }
            }
        }

        return false;
    }

    check_3_3_v(x, y) {
        let open_3 = this.get_open_3();
        
        for(let i in open_3) {
            for(let j=x-open_3[i].length+1; j<=x; j++) {
                if((j < 0) || (j + open_3[i].length - 1 > this.board_size[0] - 1)) continue;

                let target = this.board.slice(j, j + open_3[i].length).map(n => n[y]);
    
                if(this.compare(target, open_3[i])) {
                    return [j, y, open_3[i]];
                }
            }
        }

        return false;
    }

    check_3_3_rs(x, y) {
        let open_3 = this.get_open_3();
        
        for(let i in open_3) {
            for(let [j, r] = [x-open_3[i].length+1, y+open_3[i].length-1]; j<=x && r>=y; [j++, r--]) {
                if((j < 0) || (r > this.board_size[1] - 1) || (j + open_3[i].length - 1 > this.board_size[0] - 1) || (r - open_3[i].length + 1 < 0)) continue;
    
                let target = this.board.slice(j, j + open_3[i].length).map((n, idx) => n[r - idx]);

                if(this.compare(target, open_3[i])) {
                    return [j, r, open_3[i]];
                }
            }
        }
        
        return false;
    }

    check_3_3_ls(x, y) {
        let open_3 = this.get_open_3();
        
        for(let i in open_3) {
            for(let [j, r] = [x-open_3[i].length+1, y-open_3[i].length+1]; j<=x && r<=y; [j++, r++]) {
                if((j < 0) || (r < 0) || (j + open_3[i].length - 1 > this.board_size[0] - 1) || (r + open_3[i].length - 1 > this.board_size[1] - 1)) continue;
    
                let target = this.board.slice(j, j + open_3[i].length).map((n, idx) => n[r + idx]);
    
                if(this.compare(target, open_3[i])) {
                    return [j, r, open_3[i]];
                }
            }
        }
        
        return false;
    }

    check_3_3() {
        for(let i=0; i<this.board_size[0]; i++) {
            for(let j=0; j<this.board_size[1]; j++) {
                // 가로
                let h = this.check_3_3_h(i, j);
                
                if(h) {
                    let [hx, hy, hopen_3] = h;
        
                    for(let n=hy; n<hy+hopen_3.length; n++) {
                        if(this.board[hx][n] != this.turn) continue;

                        let v = this.check_3_3_v(hx, n);
                        let rs = this.check_3_3_rs(hx, n);
                        let ls = this.check_3_3_ls(hx, n);
                        
                        console.log("h " + v + ", " + rs + ", " + ls);
                        if(v || rs || ls) {
                            return true;
                        }
                    }
                }

                // 세로
                let v = this.check_3_3_v(i, j);
                
                if(v) {
                    let [vx, vy, vopen_3] = v;
        
                    for(let n=vx; n<vx+vopen_3.length; n++) {
                        if(this.board[n][vy] != this.turn) continue;

                        let h = this.check_3_3_h(n, vy);
                        let rs = this.check_3_3_rs(n, vy);
                        let ls = this.check_3_3_ls(n, vy);
        
                        console.log("v " + h + ", " + rs + ", " + ls);
                        if(h || rs || ls) {
                            return true;
                        }
                    }
                }

                // 오른쪽 대각선
                let rs = this.check_3_3_rs(i, j);
                
                if(rs) {
                    let [rsx, rsy, rsopen_3] = rs;
        
                    for(let [n, r] = [rsx, rsy]; n<=rsx+rsopen_3.length-1 && r>=rsy-rsopen_3.length+1; [n++, r--]) {
                        if(this.board[n][r] != this.turn) continue;

                        let h = this.check_3_3_h(n, r);
                        let v = this.check_3_3_v(n, r);
                        let ls = this.check_3_3_ls(n, r);
        
                        console.log("rs " + h + ", " + v + ", " + ls);
                        if(h || v || ls) {
                            return true;
                        }
                    }
                }

                // 왼쪽 대각선
                let ls = this.check_3_3_ls(i, j);
                
                if(ls) {
                    let [lsx, lsy, lsopen_3] = ls;
        
                    for(let [n, r] = [lsx, lsy]; n<=lsx+lsopen_3.length && r<=lsy+lsopen_3.length; [n++, r++]) {
                        if(this.board[n][r] != this.turn) continue;

                        let h = this.check_3_3_h(n, r);
                        let v = this.check_3_3_v(n, r);
                        let rs = this.check_3_3_rs(n, r);
        
                        console.log("ls " + h + ", " + v + ", " + rs);
                        if(h || v || rs) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    check_4_4_h(x, y) {
        let open_4 = this.get_open_4();
        
        for(let i in open_4) {
            for(let j=y-open_4[i].length+1; j<=y; j++) {
                if((j < 0) || (j + open_4[i].length - 1 > this.board_size[1] - 1)) continue;

                let target = this.board[x].slice(j, j + open_4[i].length);
    
                if(this.compare(target, open_4[i])) {
                    return [x, j, open_4[i]];
                }
            }
        }

        return false;
    }

    check_4_4_v(x, y) {
        let open_4 = this.get_open_4();
        
        for(let i in open_4) {
            for(let j=x-open_4[i].length+1; j<=x; j++) {
                if((j < 0) || (j + open_4[i].length - 1 > this.board_size[0] - 1)) continue;

                let target = this.board.slice(j, j + open_4[i].length).map(n => n[y]);
    
                if(this.compare(target, open_4[i])) {
                    return [j, y, open_4[i]];
                }
            }
        }

        return false;
    }

    check_4_4_rs(x, y) {
        let open_4 = this.get_open_4();
        
        for(let i in open_4) {
            for(let [j, r] = [x-open_4[i].length+1, y+open_4[i].length-1]; j<=x && r>=y; [j++, r--]) {
                if((j < 0) || (r > this.board_size[1] - 1) || (j + open_4[i].length - 1 > this.board_size[0] - 1) || (r - open_4[i].length + 1 < 0)) continue;
    
                let target = this.board.slice(j, j + open_4[i].length).map((n, idx) => n[r - idx]);
    
                if(this.compare(target, open_4[i])) {
                    return [j, r, open_4[i]];
                }
            }
        }
        
        return false;
    }

    check_4_4_ls(x, y) {
        let open_4 = this.get_open_4();
        
        for(let i in open_4) {
            for(let [j, r] = [x-open_4[i].length+1, y-open_4[i].length+1]; j<=x && r<=y; [j++, r++]) {
                if((j < 0) || (r < 0) || (j + open_4[i].length - 1 > this.board_size[0] - 1) || (r + open_4[i].length - 1 > this.board_size[1] - 1)) continue;
    
                let target = this.board.slice(j, j + open_4[i].length).map((n, idx) => n[r + idx]);
    
                if(this.compare(target, open_4[i])) {
                    return [j, r, open_4[i]];
                }
            }
        }
        
        return false;
    }

    check_4_4() {
        for(let i=0; i<this.board_size[0]; i++) {
            for(let j=0; j<this.board_size[1]; j++) {
                // 가로
                let h = this.check_4_4_h(i, j);
                
                if(h) {
                    let [hx, hy, hopen_4] = h;
        
                    for(let n=hy; n<hy+hopen_4.length; n++) {
                        if(this.board[hx][n] != this.turn) continue;

                        let v = this.check_4_4_v(hx, n);
                        let rs = this.check_4_4_rs(hx, n);
                        let ls = this.check_4_4_ls(hx, n);
                        
                        console.log("h " + v + ", " + rs + ", " + ls);
                        if(v || rs || ls) {
                            return true;
                        }
                    }
                }

                // 세로
                let v = this.check_4_4_v(i, j);
                
                if(v) {
                    let [vx, vy, vopen_4] = v;
        
                    for(let n=vx; n<vx+vopen_4.length; n++) {
                        if(this.board[n][vy] != this.turn) continue;

                        let h = this.check_4_4_h(n, vy);
                        let rs = this.check_4_4_rs(n, vy);
                        let ls = this.check_4_4_ls(n, vy);
        
                        console.log("v " + h + ", " + rs + ", " + ls);
                        if(h || rs || ls) {
                            return true;
                        }
                    }
                }

                // 오른쪽 대각선
                let rs = this.check_4_4_rs(i, j);
                
                if(rs) {
                    let [rsx, rsy, rsopen_4] = rs;
        
                    for(let [n, r] = [rsx, rsy]; n<=rsx+rsopen_4.length-1 && r>=rsy-rsopen_4.length+1; [n++, r--]) {
                        if(this.board[n][r] != this.turn) continue;

                        let h = this.check_4_4_h(n, r);
                        let v = this.check_4_4_v(n, r);
                        let ls = this.check_4_4_ls(n, r);
        
                        console.log("rs " + h + ", " + v + ", " + ls);
                        if(h || v || ls) {
                            return true;
                        }
                    }
                }

                // 왼쪽 대각선
                let ls = this.check_4_4_ls(i, j);
                
                if(ls) {
                    let [lsx, lsy, lsopen_4] = ls;
        
                    for(let [n, r] = [lsx, lsy]; n<=lsx+lsopen_4.length && r<=lsy+lsopen_4.length; [n++, r++]) {
                        if(this.board[n][r] != this.turn) continue;

                        let h = this.check_4_4_h(n, r);
                        let v = this.check_4_4_v(n, r);
                        let rs = this.check_4_4_rs(n, r);
        
                        console.log("ls " + h + ", " + v + ", " + rs);
                        if(h || v || rs) {
                            return true;
                        }
                    }
                }
            }
        }

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

    put(_x, _y) {
        let x = _x + 1;
        let y = _y + 1;

        if(this.board[x][y] != this.space_c) return false;

        this.board[x][y] = this.turn;

        if(this.turn == this.black_c && (this.check_3_3() || this.check_4_4() || this.check_over_6(x, y))) {
            console.log("Wrong!");

            this.board[x][y] = this.space_c;

            return false;
        }

        if(this.check_end(x, y)) {
            console.log("Game over! win : " + this.turn);

            return true;
        }

        this.turn = this.turn == this.black_c? this.white_c : this.black_c;

        return null;
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