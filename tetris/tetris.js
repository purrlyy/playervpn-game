
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20);
let makeMatrix = function(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
},
    makePiece = ((type) => {
        switch (type) {
            case "t": return [
                [0, 0, 0],
                [5, 5, 5],
                [0, 5, 0]
            ];
            case "o": return [
                [7, 7],
                [7, 7]
            ];
            case "l": return [
                [0, 4, 0],
                [0, 4, 0],
                [0, 4, 4]
            ];
            case "j": return [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ];
            case "i": return [
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0]
            ];
            case "s": return [
                [0, 3, 3],
                [3, 3, 0],
                [0, 0, 0]
            ];
            case "z": return [
                [6, 6, 0],
                [0, 6, 6],
                [0, 0, 0]
            ];
        }
    }),
    points = function(inter) {
        let rowCount = 0;
        outer: for (let y = area.length - 1; y > 0; --y) {
            for (let x = 0; x < area[y].length; ++x) if (area[y][x] === 0) continue outer;
            const row = area.splice(y, 1)[0].fill(0);
            area.unshift(row);
            ++y;
            rowCount += 1;
        }
        let rows = ((n) => {
            switch (n) {
                case 1: return 40;
                case 2: return 100;
                case 3: return 300;
                case 4: return 1200;
                default: return 0;
            }
        })(rowCount);
        player.score += rows * (player.level + 1);
        player.lines += rowCount;
        if (player.lines >= (player.level + 1) * 10) {
            player.level++;
            if (dropInter > 0 && mode == 0) dropInter = 100 - ((10 / 3) * player.level);
        }
        if(!inter) return;
        if(rowCount) {
            player.combo += 1;
            player.score += (50 * player.combo * player.level);
        } else player.combo = 0;
    },
    collide = function(area, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y)
            for (let x = 0; x < m[y].length; ++x)
                if (m[y][x] !== 0 && (area[y + o.y] && area[y + o.y][x + o.x]) !== 0)
                    return true;
        return false;
    },
    drawMatrix = function(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    let imgTag = document.createElement("IMG");
                    imgTag.src = colors[value];
                    context.drawImage(imgTag, x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
        ctx = document.getElementById('block').getContext('2d');
        ctx.clearRect(0, 0, 80, 480);
        next.forEach((nxt, i) => {
            makePiece(nxt).forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        let img = document.createElement("IMG");
                        img.src = colors[value];
                        let Offset = ((next) => {
                            switch (next) {
                                case 'i': return [1, 0.5];
                                case 'j': return [1.5, 1];
                                case 'l': return [0.5, 1];
                                case 'o': return [1.5, 1.5];
                                case 's':
                                case 'z': return [1, 1.5];
                                case 't': return [1, 0.5];
                                default: return [0, 0];
                            }
                        })(nxt).map(x => x * 16)
                        ctx.drawImage(img, x * 16 + Offset[0], (y * 16 + Offset[1]) + (80 * i), 16, 16);
                    }
                });
            });
        });
        if (hold) {
            ctx = document.getElementById('hold').getContext('2d');
            ctx.clearRect(0, 0, 80, 80);
            makePiece(hold).forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        let img = document.createElement("IMG");
                        img.src = colors[value];
                        let Offset = ((hold) => {
                            switch (hold) {
                                case 'i': return [1, 0.5];
                                case 'j': return [1.5, 1];
                                case 'l': return [0.5, 1];
                                case 'o': return [1.5, 1.5];
                                case 's':
                                case 'z': return [1, 1.5];
                                case 't': return [1, 0.5];
                                default: return [0, 0];
                            }
                        })(hold).map(x => x * 16)
                        ctx.drawImage(img, x * 16 + Offset[0], y * 16 + Offset[1], 16, 16);
                    }
                });
            });
        } else document.getElementById('hold').getContext('2d').clearRect(0, 0, 80, 80);
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    let imgTag = document.createElement("IMG");
                    imgTag.src = colors[value];
                    context.globalAlpha = 0.25;
                    context.drawImage(imgTag, x + player.ghost.x, y + player.ghost.y, 1, 1);
                    context.globalAlpha = 1.0;
                }
            });
        });
    },
    merge = function(area, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) area[y + player.pos.y][x + player.pos.x] = value;
            });
        });
    },
    rotate = function(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y)
            for (let x = 0; x < y; ++x)
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y],]
        if (dir > 0) matrix.forEach(row => row.reverse());
        else matrix.reverse();
    },
    next = [],
    hold = null,
    held = false,
    holdKey,
    playerReset = function(a) {
        player.score += player.drop;
        player.drop = 0;
        const pieces = "ijlostz";
        player.matrix = makePiece(next[0] || pieces[Math.floor(Math.random() * pieces.length)]);
        player.key = next[0];
        next.shift();
        while (next.length != 6) next.push(pieces[Math.floor(Math.random() * pieces.length)]);
        player.pos.y = 0;
        player.pos.x = (Math.floor(area[0].length / 2)) - (Math.floor(player.matrix[0].length / 2));
        if (collide(area, player)) {
            area.forEach(row => row.fill(0));
            gameRun = false;
        };
        held = false;
    },
    swap = function() {
        player.matrix = makePiece(player.key);
        player.pos.y = 0;
        player.pos.x = (Math.floor(area[0].length / 2)) - (Math.floor(player.matrix[0].length / 2));
        if (collide(area, player)) gameRun = false;
    },
    playerDrop = function(press, inter) {
        if (press && player.drop < 20) player.drop += press;
        player.pos.y++;
        if (collide(area, player)) {
            player.pos.y--;
            if (player.merge) {
                player.merge = false;
                merge(area, player);
                points(inter);
                playerReset();
                updateScore();
            };
        } else player.merge = false;
        player.wait = 0;
    },
    playerSlam = function() {
        while (!collide(area, player)) {
            player.pos.y++;
            if (player.drop <= 38) player.drop += 2
            if (collide(area, player)) {
                player.merge = false;
                player.pos.y--;
                merge(area, player);
                points();
                playerReset();
                updateScore();
                break;
            }
        }
        if (collide(area, player)) player.pos.y--
    },
    playerMove = function(dir) {
        player.pos.x += dir;
        if (collide(area, player)) player.pos.x -= dir;
    },
    playerRotate = function(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        while (collide(area, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    },
    draw = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        updateScore();
        drawMatrix(area, { x: 0, y: 0 });
        drawMatrix(player.matrix, player.pos);
    },
    dropInter,
    time = 0,
    wait = 0,
    update = function() {
        time++;
        if (time >= dropInter) {
            playerDrop(0, true);
            time = 0;
        };
        if (player.wait >= 150) player.merge = true;
        if (player.wait > 300) {
            player.merge = false;
            player.wait = 0;
        };
        player.wait++;
        player.ghost.x = player.pos.x;
        draw();
        ghostPos();
    },
    updateScore = function() {
        document.getElementById('scores').innerText = `Score: ${player.score}\nLevel: ${player.level}\nLines: ${player.lines}\nCombo: ${player.combo}`
    },
    gameOver = function() {
        clearInterval(gameLoop);
        document.getElementById('start').hidden = true;
        document.getElementById('end').hidden = false;
        document.getElementById('game').hidden = true;
        time = Date.now() - start;
        let days = Math.floor(time / 86400000);
        let hours = Math.floor(time / 3600000) % 24;
        let minutes = Math.floor(time / 60000) % 60;
        let seconds = Math.floor(time / 1000) % 60;
        document.getElementById('score').innerHTML = `Score - ${player.score}<br>Time Played - ${days ? `${days}d ` : ''}${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${seconds ? `${seconds}s` : ''}<br>Mode - ${modes[mode]}`
    },
    colors = [
        null,
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACpJREFUOE9jZGDY9J+BAsAIMcCXTCM2M4waMBoGDAyjYUDNMCAzMwK1AQDjSykhN5JcnQAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACxJREFUOE9jZNi06T8DBYARbICvL3lGbN7MMGrAaBgwjKYDBiqGAXl5EawLAJF3QkECpA9wAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACtJREFUOE9jZNjE8J+BAsAINsCXTBM2MzCMGjAaBgyj6YCBimFAZmYEaQMA/GspIc4pj6gAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAC1JREFUOE9j3GTN8J+BAsAIMsBXkjwTNj9nYBg1YDQMRtMBAwP1woC8vAjRBQAlLzrR12PaPgAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAC5JREFUOE9jDGVY/5+BAsAIMkCbIYAsI64ybGAYNWA0DEbTAQMD9cKArKwI1QQAXkQ8QRSVCwEAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACxJREFUOE9j3MTA8J+BAsAIMsCXTAM2MzAwjBowGgaj6YCBgXphQGZmBGsDABWaKSGD4DCRAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAC1JREFUOE9j3LSJ4T8DBYARZICvL3kmbN7MwDBqwGgYjKYDBgbqhQF5eRGiCwDDt0JBZn9JGwAAAABJRU5ErkJggg=="
    ],
    area = makeMatrix(10, 20),
    player = {
        pos: { x: 0, y: 0 },
        matrix: null,
        score: 0,
        key: null,
        ghost: { x: 0, y: 0 },
        drop: 0,
        level: 0,
        lines: 0,
        combo: 0,
        wait: 0,
        merge: false,
    },
    modes = ['Marathon', 'Practice'],
    mode = 0,
    gameLoop,
    gameRun = false,
    pause = false,
    ghostPos = function() {
        player.ghost.y = Number(player.pos.y);
        while (!collide(area, { pos: player.ghost, matrix: player.matrix })) {
            player.ghost.y++;
            if (collide(area, { pos: player.ghost, matrix: player.matrix })) {
                player.ghost.y--;
                updateScore();
                break;
            }
        }
        if (collide(area, { pos: player.ghost, matrix: player.matrix })) player.ghost.y--
    };
playerReset();
draw();
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 112) pause = !pause;
    else if (!gameRun || pause) return;
    else if (e.keyCode == 37 || e.keyCode == 100 || e.keyCode == 65) playerMove(-1);
    else if (e.keyCode == 39 || e.keyCode == 102 || e.keyCode == 68) playerMove(+1);
    else if (e.keyCode == 40 || e.keyCode == 98 || e.keyCode == 83) playerDrop(1);
    else if ([38, 87, 88, 97, 101, 105].includes(e.keyCode)) playerRotate(1);
    else if ([17, 90, 99, 103].includes(e.keyCode)) playerRotate(-1);
    else if (e.keyCode == 32 || e.keyCode == 104) playerSlam();
    else if ((e.keyCode == 16 || e.keyCode == 67 || e.keyCode == 96) && !held) {
        if (!hold) [hold, player.key] = [player.key, next.shift()];
        else[hold, player.key] = [player.key, hold];
        player.matrix = makePiece(hold);
        swap();
        held = true;
    }
});
Array.from(document.getElementsByClassName('start_but')).forEach(x => x.addEventListener('click', () => {
    document.getElementById('game').hidden = false;
    document.getElementById('start').hidden = true;
    hold = null;
    gameRun = true;
    playerReset();
    dropInter = 100;
    player.score = 0;
    player.drop = 0;
    player.level = 0;
    player.lines = 0;
    mode = modes.indexOf(x.id);
    start = Date.now();
    gameLoop = setInterval(function() {
        if (pause) {
            draw();
            ghostPos();
            context.font = "2px Fredoka One";
            context.globalAlpha = 0.5;
            context.fillStyle = "#000";
            context.fillRect(0, 0, 200, 400);
            context.globalAlpha = 1;
            context.fillStyle = "#fff";
            context.fillText("Paused", 1.4, 9.5);
        } else {
            if (gameRun) update();
            else gameOver();
        }
    }, 10);
}));
document.querySelectorAll('#but_back').forEach(x => {
    x.addEventListener('click', () => {
        document.getElementById('end').hidden = true;
        document.getElementById('settings').hidden = true;
        document.getElementById('start').hidden = false;
    });
});
document.getElementById('leave_but').onclick = () => {
    location.assign('../games')
}
