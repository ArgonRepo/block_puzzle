var xyMap = [];
var zMap = [];
function initXY() {
    var n, t, i;
    for (let r = 0; r < 512; r++) {
        let u = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0
        },
            e = 0,
            f = r;
        n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) t = f % 2, f = Math.floor(f / 2), t && n && (u[n]++, n = 0), n += !t;
        n && u[n]++;
        for (i in u) e += (10 - Number(i)) * u[i];
        xyMap.push(e)
    }
}

function initZ() {
    var i, r, n, f, e, o, t, u;
    for (let s = 0; s < 512; s++) {
        let h = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0
        },
            c = 0;
        r = [
            [],
            [],
            []
        ];
        n = s;
        for (let t = 8; t >= 0; t--) f = n % 2, n = Math.floor(n / 2), e = Math.floor(t / 3), o = t % 3, r[e][o] = f;
        t = function (n, u) {
            let f = 0;
            return n < GAME_INFO.BOARD_BLOCK_SET_WIDTH && u < GAME_INFO.BOARD_BLOCK_SET_WIDTH && !i[n * GAME_INFO.BOARD_BLOCK_SET_WIDTH + u] && r[n][u] && (i[n * GAME_INFO.BOARD_BLOCK_SET_WIDTH + u] = !0, f = 1 + t(n + 1, u) + t(n, u + 1)), f
        };
        i = {
            0: !1,
            1: !1,
            2: !1,
            3: !1,
            4: !1,
            5: !1,
            6: !1,
            7: !1,
            8: !1
        };
        for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++)
            for (let i = 0; i < GAME_INFO.BOARD_BLOCK_SET_WIDTH; i++) {
                let r = t(n, i);
                r && h[r]++
            }
        for (u in h) c += (10 - Number(u)) * h[u];
        zMap.push(c)
    }
}

const STREAK_VALUE = 10;
function bestSolutionCheck(n, t, i) {
    let tVal = t.score + t.strik * STREAK_VALUE;
    let nVal = n.score + n.strik * STREAK_VALUE;
    if (n.step.length === 0 || tVal > nVal) Object.assign(n, t), n.statusScore = i.evaluateStatus();
    else if (tVal === nVal) {
        let r = i.evaluateStatus();
        n.statusScore > r && (Object.assign(n, t), n.statusScore = r)
    }
}

function GetScore(n, t, i) {
    return t > 0 ? n.score + [0, 18, 42, 66, 90, 114, 132, 150, 168][t] + i * 5 : n.score
}

function dfs(n, t, i, r, u) {
    if (i === t.length) {
        bestSolutionCheck(r, u, n);
        return
    }
    const f = t[i];
    var e = !1;
    for (let o = 0; o <= 9 - f.h; o++)
        for (let s = 0; s <= 9 - f.w; s++)
            if (n.canPutAt(s, o, f)) {
                e = !0;
                let c = n.clone();
                c.putAt(s, o, f);
                let l = c.checkAndEliminate(),
                    a = l > 0 ? u.strik + 1 : 0,
                    h = cloneSolution(u);
                h.step.push({
                    x: s,
                    y: o,
                    shape: f
                });
                h.strik = a;
                h.score += GetScore(f, l, u.strik);
                dfs(c, t, i + 1, r, h)
            } e || u.step.length >= r.step.length && bestSolutionCheck(r, u, n)
}

function putShapes(n, t, i) {
    if (t.length !== 3) return !1;
    var r = clone(i);
    const u = getPermutations(t);
    for (let t of u) {
        let u = JSON.parse(t);
        dfs(n, u, 0, i, clone(r))
    }
    return !0
}
class slover {
    constructor() {
        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        // 前期权重：侧重得分、streak，空间充裕不需过度保守
        this.earlyWeights = {
            a: 5.44, b: 6.17, c: 5.85, d: 3.9, f: 3.53,
            g: -5.76, h: -.66, i: -3.0, j: -1.5, k: 1.5, l: -2.0
        };
        // 后期权重：侧重生存，极度重视消除、连通性、容纳度
        this.lateWeights = {
            a: 8.0, b: 9.0, c: 8.5, d: 2.0, f: 3.53,
            g: -12.0, h: -1.5, i: -9.0, j: -8.0, k: 6.0, l: -6.0
        };
    }
    clone() {
        for (var t = new slover, n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t.board[n] = this.board[n].slice();
        return t
    }
    canEliminateRow(n) {
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++)
            if (this.board[n][t] === 0) return !1;
        return !0
    }
    canEliminateCol(n) {
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++)
            if (this.board[t][n] === 0) return !1;
        return !0
    }
    canEliminateBlock(n, t) {
        for (let i = 0; i < 3; i++)
            for (let r = 0; r < 3; r++)
                if (this.board[n + i][t + r] === 0) return !1;
        return !0
    }
    canEliminateBlockSet(n) {
        n = Number(n);
        let t = n % GAME_INFO.BOARD_BLOCK_SET_WIDTH * GAME_INFO.BOARD_BLOCK_SET_WIDTH,
            i = Math.floor(n / GAME_INFO.BOARD_BLOCK_SET_WIDTH) * GAME_INFO.BOARD_BLOCK_SET_WIDTH;
        return this.canEliminateBlock(i, t)
    }
    checkAndEliminate() {
        var t = [],
            n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++)
            if (this.canEliminateRow(i)) {
                for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t.push([i, n]);
                n++
            } for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++)
            if (this.canEliminateCol(i)) {
                for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t.push([n, i]);
                n++
            } for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t += 3)
            for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i += 3)
                if (this.canEliminateBlock(t, i)) {
                    for (let n = 0; n < 3; n++)
                        for (let r = 0; r < 3; r++) this.board[t + n][i + r] = 0;
                    n++
                } for (let n of t) this.board[n[0]][n[1]] = 0;
        return n
    }
    canPutAt(n, t, i) {
        for (var u, r = 0; r < i.h; r++)
            for (u = 0; u < i.w; u++) {
                let f = this.board[r + t][u + n],
                    e = i.s[r * i.w + u];
                if (f === 1 && e === 1) return !1
            }
        return !0
    }
    putAt(n, t, i) {
        for (var u, r = 0; r < i.h; r++)
            for (u = 0; u < i.w; u++) this.board[r + t][u + n] |= i.s[r * i.w + u]
    }
    getBlockSet_fast(n) {
        n = Number(n);
        let t = 0,
            i = n % GAME_INFO.BOARD_BLOCK_SET_WIDTH * GAME_INFO.BOARD_BLOCK_SET_WIDTH,
            r = Math.floor(n / GAME_INFO.BOARD_BLOCK_SET_WIDTH) * GAME_INFO.BOARD_BLOCK_SET_WIDTH;
        for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++) {
            var u = n + r;
            for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++) t = t * 2 + this.board[u][n + i]
        }
        return t
    }
    getX_fast() {
        let n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            var t = 0;
            for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t = t * 2 + this.board[n][i];
            n += xyMap[t]
        }
        return n /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n = Math.round(n * 100) / 100
    }
    getY_fast() {
        let n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            var t = 0;
            for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t = t * 2 + this.board[i][n];
            n += xyMap[t]
        }
        return n /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n = Math.round(n * 100) / 100
    }
    getZ_fast() {
        let n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            var t = this.getBlockSet_fast(i);
            n += zMap[t]
        }
        return n /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n = Math.round(n * 100) / 100
    }
    getW() {
        let n = 0;
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++)
            for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) n += this.board[t][i];
        return n /= Math.pow(GAME_INFO.BOARD_SIZE_BLOCK, 2), Math.round(n * 100) / 100
    }
    getT() {
        let n = 0;
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++) n += this.canEliminateBlockSet(t) ? 1 : 0, n += this.canEliminateRow(t) ? 1 : 0, n += this.canEliminateCol(t) ? 1 : 0;
        return n /= 3 * GAME_INFO.BOARD_SIZE_BLOCK, Math.round(n * 100) / 100
    }
    getNearT() {
        let score = 0;
        const S = GAME_INFO.BOARD_SIZE_BLOCK;
        for (let r = 0; r < S; r++) {
            let filled = 0;
            for (let c = 0; c < S; c++) filled += this.board[r][c];
            if (filled >= S - 2 && filled < S) score += filled / S;
        }
        for (let c = 0; c < S; c++) {
            let filled = 0;
            for (let r = 0; r < S; r++) filled += this.board[r][c];
            if (filled >= S - 2 && filled < S) score += filled / S;
        }
        for (let br = 0; br < S; br += 3)
            for (let bc = 0; bc < S; bc += 3) {
                let filled = 0;
                for (let r = 0; r < 3; r++)
                    for (let c = 0; c < 3; c++) filled += this.board[br + r][bc + c];
                if (filled >= 7 && filled < 9) score += filled / 9;
            }
        return Math.round(score / (3 * S) * 100) / 100
    }
    getCrossEliminationPotential() {
        const S = GAME_INFO.BOARD_SIZE_BLOCK;
        let potential = 0;
        const rowFill = [], colFill = [], blkFill = [];
        for (let r = 0; r < S; r++) {
            let f = 0;
            for (let c = 0; c < S; c++) f += this.board[r][c];
            rowFill.push(f);
        }
        for (let c = 0; c < S; c++) {
            let f = 0;
            for (let r = 0; r < S; r++) f += this.board[r][c];
            colFill.push(f);
        }
        for (let br = 0; br < S; br += 3)
            for (let bc = 0; bc < S; bc += 3) {
                let f = 0;
                for (let r = 0; r < 3; r++)
                    for (let c = 0; c < 3; c++) f += this.board[br + r][bc + c];
                blkFill.push(f);
            }
        for (let r = 0; r < S; r++)
            for (let c = 0; c < S; c++) {
                if (this.board[r][c] === 1) continue;
                let rF = rowFill[r] / S;
                let cF = colFill[c] / S;
                let bI = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                let bF = blkFill[bI] / 9;
                let count = (rF >= 7 / 9 ? 1 : 0) + (cF >= 7 / 9 ? 1 : 0) + (bF >= 7 / 9 ? 1 : 0);
                if (count >= 2) potential += rF * cF * bF;
            }
        return Math.round(potential / (S * S) * 100) / 100
    }
    getAccommodability() {
        let total = 0;
        const S = GAME_INFO.BOARD_SIZE_BLOCK;
        for (let si = 0; si < shapes.length; si++) {
            const sh = shapes[si];
            let canFit = false;
            for (let r = 0; r <= S - sh.h && !canFit; r++)
                for (let c = 0; c <= S - sh.w && !canFit; c++)
                    if (this.canPutAt(c, r, sh)) canFit = true;
            if (canFit) total++;
        }
        return Math.round(total / shapes.length * 100) / 100
    }
    getEmptyConnectivity() {
        const S = GAME_INFO.BOARD_SIZE_BLOCK;
        const visited = [];
        for (let i = 0; i < S * S; i++) visited.push(false);
        let regionCount = 0, maxRegion = 0;
        const floodFill = (r, c) => {
            if (r < 0 || r >= S || c < 0 || c >= S) return 0;
            const idx = r * S + c;
            if (visited[idx] || this.board[r][c] === 1) return 0;
            visited[idx] = true;
            return 1 + floodFill(r - 1, c) + floodFill(r + 1, c) + floodFill(r, c - 1) + floodFill(r, c + 1);
        };
        for (let r = 0; r < S; r++)
            for (let c = 0; c < S; c++)
                if (!visited[r * S + c] && this.board[r][c] === 0) {
                    let size = floodFill(r, c);
                    regionCount++;
                    if (size > maxRegion) maxRegion = size;
                }
        // 理想状态：1个大连通区域。碎片越多越差。
        // 返回值越高越好（接近1表示空间集中在一个大区域）
        let totalEmpty = 0;
        for (let r = 0; r < S; r++)
            for (let c = 0; c < S; c++) totalEmpty += (1 - this.board[r][c]);
        if (totalEmpty === 0) return 0;
        return Math.round(maxRegion / totalEmpty * 100) / 100
    }
    getS() {
        var i, t, r;
        let n = {
            divCount: {},
            divValue: 0
        };
        i = [];
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK; t++) n.divCount[t + 1] = 0, i.push(!1);
        t = function (n, r, u) {
            let f = 0,
                e = u * GAME_INFO.BOARD_SIZE_BLOCK + r;
            return u < GAME_INFO.BOARD_SIZE_BLOCK && r < GAME_INFO.BOARD_SIZE_BLOCK && !i[e] && n[u][r] && (i[e] = !0, f = 1 + t(n, r + 1, u) + t(n, r, u + 1) + t(n, r + 1, u + 1)), f
        };
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            let r = t(this.board, i % GAME_INFO.BOARD_SIZE_BLOCK, Math.floor(i / GAME_INFO.BOARD_SIZE_BLOCK));
            r && n.divCount[r]++
        }
        for (r in n.divCount) n.divValue += (GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK + 1 - Number(r)) * n.divCount[r];
        return n.divValue /= GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK * 45, n.divValue = Math.round(n.divValue * 100) / 100, n
    }
    evaluateStatus() {
        let density = this.getW();
        // 线性插值：density 0→前期权重, density 1→后期权重
        let w = {};
        for (let key in this.earlyWeights) {
            w[key] = this.earlyWeights[key] * (1 - density) + this.lateWeights[key] * density;
        }
        let n = w.a * this.getX_fast()
            + w.b * this.getY_fast()
            + w.c * this.getZ_fast()
            + w.d * density
            + w.f
            + w.g * this.getT()
            + w.h * this.getS().divValue
            + w.i * this.getNearT()
            + w.j * this.getAccommodability()
            + w.k * this.getEmptyConnectivity()
            + w.l * this.getCrossEliminationPotential();
        return Math.abs(n)
    }
}
initXY();
initZ();
