
var w, h, ratio, el, el2, g, g2, my = {};
function gomokuMain(mode) {
    var version = '0.64';
    my.typ = typeof mode !== 'undefined' ? mode : 'bla';
    my.last = {
        xn: -1,
        yn: -1
    }
    my.hdrHt = 65
    my.bdSzs = [{
        title: '9 by 9',
        sz: 9
    }, {
        title: '13 by 13',
        sz: 13
    }, {
        title: '19 by 19',
        sz: 19
    }];
    my.bdSz = 19
    my.game = {
        board: []
    }
    my.players = [{
        name: 'empty'
    }, {
        name: 'Black',
        clr: 'black',
        lvl: 0
    }, {
        name: 'White',
        clr: 'white',
        lvl: 1
    }, ];
    my.playerNo = 1
    my.player = my.players[my.playerNo]
    my.lvls = [{
        name: 'Human',
        title: 'Human'
    }, {
        name: 'Easy',
        title: 'AI Easy',
        depth: 0,
        bestn: 3
    }, {
        name: 'Medium',
        title: 'AI Medium',
        depth: 1,
        bestn: 2
    }, {
        name: 'Hard',
        title: 'AI Hard',
        depth: 2,
        bestn: 0
    }, ]
    ratio = 3;
    my.playQ = true
    gameNew()
}
function gameNew() {
    clearTimeout(my.timeid)
    var pcWd = Math.min(60, w / my.bdSz, (h - my.hdrHt) / my.bdSz)
    var bdWd = pcWd * (my.bdSz - 1)
    my.rect = {
        lt: pcWd / 2,
        tp: pcWd / 2 + my.hdrHt,
        wd: bdWd,
        ht: bdWd
    }
    my.rect.rt = my.rect.lt + my.rect.wd
    my.rect.bt = my.rect.tp + my.rect.ht
    my.rect.pcWd = pcWd
    console.log('my.rect', my, my.rect)
    my.moveN = 0
    var player = my.players[my.playerNo]
    var b = []
    for (var i = 0; i < my.bdSz; i++) {
        b[i] = []
        for (var j = 0; j < my.bdSz; j++) {
            b[i][j] = 0
        }
    }
    my.game.board = b

    if (my.players[my.playerNo].lvl > 0) {
        my.playQ = false
        var mid = Math.round(my.bdSz / 2) - 1
        my.game.board[mid][mid] = my.playerNo
        turnNext()
    } else {
        my.playQ = true
    }
}
function setGame(ai_level) {
    my.players[1].lvl = 0;
    my.players[2].lvl = ai_level; // 1 : easy, 2 : middle, 3 : hard
    my.bdSz = 19; // 19 x 19
    console.log("popYes", my.players, my.bdSz);
    gameNew();
}
function turnNext(callback) {
    my.playQ = false
    var c = new AI()
    if (c.full(my.game.board)) {
        // draw
        my.playQ = false

        callback(-1, -1, 3);

        return false;
    }
    if (c.terminalState(my.game.board)) {
        // win
        var player = my.players[my.playerNo]
        my.playQ = false

        callback(-1, -1, my.playerNo == 1? 1 : 2);

        return false;
    }
    my.playerNo = (my.playerNo == 1) ? 2 : 1
    var player = my.players[my.playerNo]
    // document.getElementById('info').style.color = player.clr
    // document.getElementById('info').innerHTML = player.name
    my.moveN++
    if (my.players[my.playerNo].lvl > 0) {
        my.playQ = false
        my.timeid = setTimeout(() => aiMove(callback), 1000)
    } else {
        my.playQ = true
    }

    return true;
}
function playerMove(x, y) {
    if(my.game.board[x][y] != 0) return false;

    my.game.board[x][y] = my.playerNo;

    return true;
}
function getBoard() {
    return my.game.board;
}
function aiMove(callback) {
    var c = new AI()
    var move = c.getMove(my.game.board)
    console.log('move', move)
    if (typeof move === "undefined") {
        // ai win
        my.playQ = false

        callback(-1, -1, 2);

        return
    }
    var xn = move[0]
    var yn = move[1]
    my.last = {
        xn: xn,
        yn: yn
    }
    my.game.board[xn][yn] = my.playerNo
    if(turnNext(callback)) callback(xn, yn, 0);
    my.last = {
        xn: -1,
        yn: -1
    }
}
function AI() {
    this.minimaxCache = {};
}
AI.prototype.nearbyMoves = function(grid) {
    var nearby = [];
    for (var i = 0; i < grid.length; i++) {
        nearby[i] = [];
    }
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            if (grid[i][j]) {
                var xMax = Math.min(i + 1, grid.length - 1);
                var yMax = Math.min(j + 1, grid.length - 1);
                for (var x = Math.max(i - 1, 0); x <= xMax; x++) {
                    for (var y = Math.max(j - 1, 0); y <= yMax; y++) {
                        nearby[x][y] = true;
                    }
                }
            }
        }
    }
    return nearby;
}
AI.prototype.getMove = function(grid) {
    var timeStt = performance.now()
    var board = {}
    board.stoneCount = 1
    if (board.stoneCount === 0)
        return [7, 7];
    var possibleMoves = this.nearbyMoves(grid);
    var player = my.players[my.playerNo]
    var lvl = my.lvls[player.lvl]
    var minimaxCurrentDepth = board.stoneCount + 1;
    var minimaxTargetDepth = board.stoneCount + 1 + lvl.depth;
    var cpuColor = board.stoneCount % 2 === 0 ? 2 : 1;
    var oppColor = cpuColor === 1 ? 2 : 1;
    var winningPosition = this.winningPosition(grid, cpuColor);
    var oppWinningPosition = this.winningPosition(grid, oppColor);
    if (winningPosition)
        return winningPosition;
    if (oppWinningPosition)
        return oppWinningPosition;
    var openFour = this.checkOpenFour(grid, cpuColor);
    if (openFour)
        return openFour;
    var position;
    var score = Number.NEGATIVE_INFINITY;
    var bests = []
    var bestlow = Number.NEGATIVE_INFINITY
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            if (possibleMoves[i][j] && !grid[i][j]) {
                grid[i][j] = cpuColor;
                var moveScore = this.minimax(grid, minimaxCurrentDepth, minimaxTargetDepth, false, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, possibleMoves, cpuColor);
                grid[i][j] = 0;
                if (moveScore > score) {
                    score = moveScore;
                    position = [i, j];
                }
                if (moveScore > bestlow) {
                    if (bests.length == 0) {
                        bests.push({
                            pos: [i, j],
                            score: moveScore
                        })
                    } else {
                        for (var n = 0; n < bests.length; n++) {
                            if (moveScore > bests[n].score) {
                                bests.splice(n, 0, {
                                    pos: [i, j],
                                    score: moveScore
                                })
                                break
                            }
                        }
                        if (bests.length > 4)
                            bests.length = 4
                    }
                    bestlow = bests[bests.length - 1].score
                }
            }
        }
    }
    this.minimaxCache = {};
    console.log('bests final', bestsFmt(bests), position)
    var choosen = Math.floor(Math.random() * lvl.bestn)
    choosen = Math.min(choosen, bests.length - 1)
    position = bests[choosen].pos
    var elapsed = (performance.now() - timeStt) / 1000
    console.log('position', player.name, choosen, elapsed, position)
    return position;
}
function bestsFmt(bests) {
    var s = ''
    for (var i = 0; i < bests.length; i++) {
        s += bests[i].pos + '=' + bests[i].score + ' '
    }
    return s
}
AI.prototype.minimax = function(grid, currentDepth, targetDepth, isMaximizingPlayer, alpha, beta, possibleMoves, cpuColor) {
    if (currentDepth === targetDepth || this.terminalState(grid)) {
        var gridHash = this.hashFunction(grid);
        if (this.minimaxCache[gridHash]) {
            return this.minimaxCache[gridHash];
        } else {
            var value = this.evaluate(grid, cpuColor);
            this.minimaxCache[gridHash] = value;
            return value;
        }
    }
    var currentColor = currentDepth % 2 === 0 ? 2 : 1;
    if (isMaximizingPlayer) {
        var bestVal = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if (possibleMoves[i][j] && !grid[i][j]) {
                    grid[i][j] = currentColor;
                    var gridHash = this.hashFunction(grid);
                    var value;
                    if (this.minimaxCache[gridHash]) {
                        value = this.minimaxCache[gridHash];
                    } else {
                        var newMoves = this.nearbyMoves(grid);
                        value = this.minimax(grid, currentDepth + 1, targetDepth, false, alpha, beta, newMoves, cpuColor);
                        this.minimaxCache[gridHash] = value;
                    }
                    grid[i][j] = 0;
                    bestVal = Math.max(bestVal, value);
                    alpha = Math.max(alpha, bestVal);
                    if (beta <= alpha)
                        break;
                }
            }
        }
        return bestVal;
    } else {
        var bestVal = Number.POSITIVE_INFINITY;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if (possibleMoves[i][j] && !grid[i][j]) {
                    grid[i][j] = currentColor;
                    var gridHash = this.hashFunction(grid);
                    var value;
                    if (this.minimaxCache[gridHash]) {
                        value = this.minimaxCache[gridHash];
                    } else {
                        var newMoves = this.nearbyMoves(grid);
                        value = this.minimax(grid, currentDepth + 1, targetDepth, true, alpha, beta, newMoves, cpuColor);
                        this.minimaxCache[gridHash] = value;
                    }
                    grid[i][j] = 0;
                    bestVal = Math.min(bestVal, value);
                    beta = Math.min(beta, bestVal);
                    if (beta <= alpha)
                        break;
                }
            }
        }
        return bestVal;
    }
}
AI.prototype.hashFunction = function(grid) {
    var hash = 0;
    var gridString = grid.toString();
    if (gridString.length === 0) {
        return hash;
    }
    for (var i = 0; i < gridString.length; i++) {
        var char = gridString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}
AI.prototype.checkOpenFour = function(grid, color) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            if ((j + 5)in grid && !grid[i][j] && !grid[i][j + 1] && grid[i][j + 2] === color && grid[i][j + 3] === color && grid[i][j + 4] === color && !grid[i][j + 5])
                return [i, j + 1];
            if ((j + 5)in grid && !grid[i][j] && grid[i][j + 1] === color && grid[i][j + 2] === color && grid[i][j + 3] === color && !grid[i][j + 4] && !grid[i][j + 5])
                return [i, j + 4];
            if ((i + 5)in grid && !grid[i][j] && !grid[i + 1][j] && grid[i + 2][j] === color && grid[i + 3][j] === color && grid[i + 4][j] === color && !grid[i + 5][j])
                return [i + 1, j];
            if ((i + 5)in grid && !grid[i][j] && grid[i + 1][j] === color && grid[i + 2][j] === color && grid[i + 3][j] === color && !grid[i + 4][j] && !grid[i + 5][j])
                return [i + 4, j];
            if ((i + 5)in grid && (j + 5)in grid && !grid[i][j] && !grid[i + 1][j + 1] && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color && !grid[i + 5][j + 5])
                return [i + 1, j + 1];
            if ((i + 5)in grid && (j + 5)in grid && !grid[i][j] && grid[i + 1][j + 1] === color && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && !grid[i + 4][j + 4] && !grid[i + 5][j + 5])
                return [i + 4, j + 4];
            if ((i - 5)in grid && (j + 5)in grid && !grid[i][j] && !grid[i - 1][j + 1] && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color && !grid[i - 5][j + 5])
                return [i - 1, j + 1];
            if ((i - 5)in grid && (j + 5)in grid && !grid[i][j] && grid[i - 1][j + 1] === color && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && !grid[i - 4][j + 4] && !grid[i - 5][j + 5])
                return [i - 4, j + 4];
        }
    }
}
AI.prototype.winningPosition = function(grid, color) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            for (var offsetCoord = 0; offsetCoord <= 4; offsetCoord++) {
                var otherCoords = [0, 1, 2, 3, 4].filter(coord=>coord !== offsetCoord);
                if ((j + 4)in grid && !grid[i][j + offsetCoord] && grid[i][j + otherCoords[0]] === color && grid[i][j + otherCoords[1]] === color && grid[i][j + otherCoords[2]] === color && grid[i][j + otherCoords[3]] === color)
                    return [i, j + offsetCoord];
                if ((i + 4)in grid && !grid[i + offsetCoord][j] && grid[i + otherCoords[0]][j] === color && grid[i + otherCoords[1]][j] === color && grid[i + otherCoords[2]][j] === color && grid[i + otherCoords[3]][j] === color)
                    return [i + offsetCoord, j];
                if ((i + 4)in grid && (j + 4)in grid && !grid[i + offsetCoord][j + offsetCoord] && grid[i + otherCoords[0]][j + otherCoords[0]] === color && grid[i + otherCoords[1]][j + otherCoords[1]] === color && grid[i + otherCoords[2]][j + otherCoords[2]] === color && grid[i + otherCoords[3]][j + otherCoords[3]] === color)
                    return [i + offsetCoord, j + offsetCoord];
                if ((i - 4)in grid && (j + 4)in grid && !grid[i - offsetCoord][j + offsetCoord] && grid[i - otherCoords[0]][j + otherCoords[0]] === color && grid[i - otherCoords[1]][j + otherCoords[1]] === color && grid[i - otherCoords[2]][j + otherCoords[2]] === color && grid[i - otherCoords[3]][j + otherCoords[3]] === color)
                    return [i - offsetCoord, j + offsetCoord];
            }
        }
    }
}
AI.prototype.full = function(grid) {
    for (var i = 0; i < my.bdSz; i++) {
        for (var j = 0; j < my.bdSz; j++) {
            if (grid[i][j] === 0)
                return false
        }
    }
    return true
}
AI.prototype.terminalState = function(grid) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            if (((j + 4)in grid && grid[i][j] === 1 && grid[i][j + 1] === 1 && grid[i][j + 2] === 1 && grid[i][j + 3] === 1 && grid[i][j + 4] === 1) || ((j + 4)in grid && grid[i][j] === 2 && grid[i][j + 1] === 2 && grid[i][j + 2] === 2 && grid[i][j + 3] === 2 && grid[i][j + 4] === 2))
                return true;
            if (((i + 4)in grid && grid[i][j] === 1 && grid[i + 1][j] === 1 && grid[i + 2][j] === 1 && grid[i + 3][j] === 1 && grid[i + 4][j] === 1) || ((i + 4)in grid && grid[i][j] === 2 && grid[i + 1][j] === 2 && grid[i + 2][j] === 2 && grid[i + 3][j] === 2 && grid[i + 4][j] === 2))
                return true;
            if (((i + 4)in grid && (j + 4)in grid && grid[i][j] === 1 && grid[i + 1][j + 1] === 1 && grid[i + 2][j + 2] === 1 && grid[i + 3][j + 3] === 1 && grid[i + 4][j + 4] === 1) || ((i + 4)in grid && (j + 4)in grid && grid[i][j] === 2 && grid[i + 1][j + 1] === 2 && grid[i + 2][j + 2] === 2 && grid[i + 3][j + 3] === 2 && grid[i + 4][j + 4] === 2))
                return true;
            if (((i - 4)in grid && (j + 4)in grid && grid[i][j] === 1 && grid[i - 1][j + 1] === 1 && grid[i - 2][j + 2] === 1 && grid[i - 3][j + 3] === 1 && grid[i - 4][j + 4] === 1) || ((i - 4)in grid && (j + 4)in grid && grid[i][j] === 2 && grid[i - 1][j + 1] === 2 && grid[i - 2][j + 2] === 2 && grid[i - 3][j + 3] === 2 && grid[i - 4][j + 4] === 2))
                return true;
        }
    }
}
AI.prototype.evaluate = function(grid, cpuColor) {
    var oppColor = cpuColor === 2 ? 1 : 2;
    function hasFive(color) {
        var count = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if ((j + 4)in grid && grid[i][j] === color && grid[i][j + 1] === color && grid[i][j + 2] === color && grid[i][j + 3] === color && grid[i][j + 4] === color)
                    count++;
                else if ((i + 4)in grid && grid[i][j] === color && grid[i + 1][j] === color && grid[i + 2][j] === color && grid[i + 3][j] === color && grid[i + 4][j] === color)
                    count++;
                else if ((i + 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i + 1][j + 1] === color && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color)
                    count++;
                else if ((i - 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i - 1][j + 1] === color && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color)
                    count++;
            }
        }
        return count;
    }
    function hasOpenFour(color) {
        var count = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if ((j + 5)in grid && !grid[i][j] && grid[i][j + 1] === color && grid[i][j + 2] === color && grid[i][j + 3] === color && grid[i][j + 4] === color && !grid[i][j + 5])
                    count++;
                else if ((i + 5)in grid && !grid[i][j] && grid[i + 1][j] === color && grid[i + 2][j] === color && grid[i + 3][j] === color && grid[i + 4][j] === color && !grid[i + 5][j])
                    count++;
                else if ((i + 5)in grid && (j + 5)in grid && !grid[i][j] && grid[i + 1][j + 1] === color && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color && !grid[i + 5][j + 5])
                    count++;
                else if ((i - 5)in grid && (j + 5)in grid && !grid[i][j] && grid[i - 1][j + 1] === color && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color && !grid[i - 5][j + 5])
                    count++;
            }
        }
        return count;
    }
    function hasFour(color) {
        var count = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if (((j + 4)in grid && !grid[i][j] && grid[i][j + 1] === color && grid[i][j + 2] === color && grid[i][j + 3] === color && grid[i][j + 4] === color) || ((j + 4)in grid && grid[i][j] === color && grid[i][j + 1] === color && grid[i][j + 2] === color && grid[i][j + 3] === color && !grid[i][j + 4]))
                    count++;
                if (((i + 4)in grid && !grid[i][j] && grid[i + 1][j] === color && grid[i + 2][j] === color && grid[i + 3][j] === color && grid[i + 4][j] === color) || ((i + 4)in grid && grid[i][j] === color && grid[i + 1][j] === color && grid[i + 2][j] === color && grid[i + 3][j] === color && !grid[i + 4][j]))
                    count++;
                if (((i + 4)in grid && (j + 4)in grid && !grid[i][j] && grid[i + 1][j + 1] === color && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color) || ((i + 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i + 1][j + 1] === color && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && !grid[i + 4][j + 4]))
                    count++;
                if (((i - 4)in grid && (j + 4)in grid && !grid[i][j] && grid[i - 1][j + 1] === color && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color) || ((i - 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i - 1][j + 1] === color && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && !grid[i - 4][j + 4]))
                    count++;
            }
        }
        return count;
    }
    function hasOpenThree(color) {
        var count = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if (((j + 5)in grid && !grid[i][j] && !grid[i][j + 1] && grid[i][j + 2] === color && grid[i][j + 3] === color && grid[i][j + 4] === color && !grid[i][j + 5]) || ((j + 5)in grid && !grid[i][j] && grid[i][j + 1] === color && grid[i][j + 2] === color && grid[i][j + 3] === color && !grid[i][j + 4] && !grid[i][j + 5]))
                    count++;
                if (((i + 5)in grid && !grid[i][j] && !grid[i + 1][j] && grid[i + 2][j] === color && grid[i + 3][j] === color && grid[i + 4][j] === color && !grid[i + 5][j]) || ((i + 5)in grid && !grid[i][j] && grid[i + 1][j] === color && grid[i + 2][j] === color && grid[i + 3][j] === color && !grid[i + 4][j] && !grid[i + 5][j]))
                    count++;
                if (((i + 5)in grid && (j + 5)in grid && !grid[i][j] && !grid[i + 1][j + 1] && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color && !grid[i + 5][j + 5]) || ((i + 5)in grid && (j + 5)in grid && !grid[i][j] && grid[i + 1][j + 1] === color && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && !grid[i + 4][j + 4] && !grid[i + 5][j + 5]))
                    count++;
                if (((i - 5)in grid && (j + 5)in grid && !grid[i][j] && !grid[i - 1][j + 1] && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color && !grid[i - 5][j + 5]) || ((i - 5)in grid && (j + 5)in grid && !grid[i][j] && grid[i - 1][j + 1] === color && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && !grid[i - 4][j + 4] && !grid[i - 5][j + 5]))
                    count++;
            }
        }
        return count;
    }
    function hasThree(color) {
        var count = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if (((j + 4)in grid && !grid[i][j] && !grid[i][j + 1] && grid[i][j + 2] === color && grid[i][j + 3] === color && grid[i][j + 4] === color) || ((j + 4)in grid && grid[i][j] === color && grid[i][j + 1] === color && grid[i][j + 2] === color && !grid[i][j + 3] && !grid[i][j + 4]))
                    count++;
                if (((i + 4)in grid && !grid[i][j] && !grid[i + 1][j] && grid[i + 2][j] === color && grid[i + 3][j] === color && grid[i + 4][j] === color) || ((i + 4)in grid && grid[i][j] === color && grid[i + 1][j] === color && grid[i + 2][j] === color && !grid[i + 3][j] && !grid[i + 4][j]))
                    count++;
                if (((i + 4)in grid && (j + 4)in grid && !grid[i][j] && !grid[i + 1][j + 1] && grid[i + 2][j + 2] === color && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color) || ((i + 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i + 1][j + 1] === color && grid[i + 2][j + 2] === color && !grid[i + 3][j + 3] && !grid[i + 4][j + 4]))
                    count++;
                if (((i - 4)in grid && (j + 4)in grid && !grid[i][j] && !grid[i - 1][j + 1] && grid[i - 2][j + 2] === color && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color) || ((i - 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i - 1][j + 1] === color && grid[i - 2][j + 2] === color && !grid[i - 3][j + 3] && !grid[i - 4][j + 4]))
                    count++;
            }
        }
        return count;
    }
    function hasOpenTwo(color) {
        var count = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if ((j + 7)in grid && !grid[i][j] && !grid[i][j + 1] && !grid[i][j + 2] && grid[i][j + 3] === color && grid[i][j + 4] === color && !grid[i][j + 5] && !grid[i][j + 6] && !grid[i][j + 7])
                    count++;
                if ((i + 7)in grid && !grid[i][j] && !grid[i + 1][j] && !grid[i + 2][j] && grid[i + 3][j] === color && grid[i + 4][j] === color && !grid[i + 5][j] && !grid[i + 6][j] && !grid[i + 7][j])
                    count++;
                if ((i + 7)in grid && (j + 7)in grid && !grid[i][j] && !grid[i + 1][j + 1] && !grid[i + 2][j + 2] && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color && !grid[i + 5][j + 5] && !grid[i + 6][j + 6] && !grid[i + 7][j + 7])
                    count++;
                if ((i - 7)in grid && (j + 7)in grid && !grid[i][j] && !grid[i - 1][j + 1] && !grid[i - 2][j + 2] && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color && !grid[i - 5][j + 5] && !grid[i - 6][j + 6] && !grid[i - 7][j + 7])
                    count++;
            }
        }
        return count;
    }
    function hasTwo(color) {
        var count = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid.length; j++) {
                if (((j + 4)in grid && !grid[i][j] && !grid[i][j + 1] && !grid[i][j + 2] && grid[i][j + 3] === color && grid[i][j + 4] === color) || ((j + 4)in grid && grid[i][j] === color && grid[i][j + 1] === color && !grid[i][j + 2] && !grid[i][j + 3] && !grid[i][j + 4]))
                    count++;
                if (((i + 4)in grid && !grid[i][j] && !grid[i + 1][j] && !grid[i + 2][j] && grid[i + 3][j] === color && grid[i + 4][j] === color) || ((i + 4)in grid && grid[i][j] === color && grid[i + 1][j] === color && !grid[i + 2][j] && !grid[i + 3][j] && !grid[i + 4][j]))
                    count++;
                if (((i + 4)in grid && (j + 4)in grid && !grid[i][j] && !grid[i + 1][j + 1] && !grid[i + 2][j + 2] && grid[i + 3][j + 3] === color && grid[i + 4][j + 4] === color) || ((i + 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i + 1][j + 1] === color && !grid[i + 2][j + 2] && !grid[i + 3][j + 3] && !grid[i + 4][j + 4]))
                    count++;
                if (((i - 4)in grid && (j + 4)in grid && !grid[i][j] && !grid[i - 1][j + 1] && !grid[i - 2][j + 2] && grid[i - 3][j + 3] === color && grid[i - 4][j + 4] === color) || ((i - 4)in grid && (j + 4)in grid && grid[i][j] === color && grid[i - 1][j + 1] === color && !grid[i - 2][j + 2] && !grid[i - 3][j + 3] && !grid[i - 4][j + 4]))
                    count++;
            }
        }
        return count;
    }
    var openFours = hasOpenFour(cpuColor);
    var closedFours = hasFour(cpuColor) - openFours;
    var openThrees = hasOpenThree(cpuColor);
    var closedThrees = hasThree(cpuColor) - openThrees;
    var openTwos = hasOpenTwo(cpuColor);
    var closedTwos = hasTwo(cpuColor) - openTwos;
    var oppOpenFours = hasOpenFour(oppColor);
    var oppClosedFours = hasFour(oppColor) - oppOpenFours;
    var oppOpenThrees = hasOpenThree(oppColor);
    var oppClosedThrees = hasThree(oppColor) - oppOpenThrees;
    var oppOpenTwos = hasOpenTwo(oppColor);
    var oppClosedTwos = hasTwo(oppColor) - oppOpenTwos;
    return (((2 * openTwos) + (1 * closedTwos) + (200 * openThrees) + (2 * closedThrees) + (2000 * openFours) + (200 * closedFours) + (2000 * hasFive(cpuColor))) - ((2 * oppOpenTwos) + (1 * oppClosedTwos) + (2000 * oppOpenThrees) + (20 * oppClosedThrees) + (20000 * oppOpenFours) + (2000 * oppClosedFours) + (20000 * hasFive(oppColor))));
}

export { gomokuMain, setGame, playerMove, turnNext, getBoard }

// gomokuMain("bla");
// setGame(1);
// playerMove(5, 5);
// turnNext();
// setTimeout(() => {
//     playerMove(5, 5);
//     turnNext();
//     setTimeout(() => console.log(my.game.board), 3000);
// }, 3000);