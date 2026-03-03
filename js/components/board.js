class board extends canvas {
    constructor(n, t, i, r, u) {
        super(n, t, i, "black");
        this.blockSize = r;
        this.spacing = u;
        this.color = ["rgba(100, 70, 68, 255)", "rgba(68, 43, 27, 255)", "rgba(62, 181, 117, 255)", "rgba(192, 10, 10, 255)"];
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
        ]
    }
    draw() {
        for (var t, r, u, n = this.spacing, i = 0; n < this.width; n += this.blockSize + this.spacing, i++)
            for (t = this.spacing, r = 0; t < this.width; t += this.blockSize + this.spacing, r++) u = (Math.floor(n / 3 / this.blockSize) + Math.floor(t / 3 / this.blockSize)) % 2, this.board[r][i] === 1 && (u = 2), this.drawRoundedRect(n, t, this.blockSize, this.blockSize, 3, this.color[u])
    }
    drawBoard(n) {
        Object.assign(this.board, n);
        this.draw()
    }
    drawShape(n, t, i) {
        for (var u, r = 0; r < i.h; r++)
            for (u = 0; u < i.w; u++) {
                let f = this.spacing + (this.spacing + this.blockSize) * (n + u),
                    e = this.spacing + (this.spacing + this.blockSize) * (t + r);
                i.s[r * i.w + u] && this.drawRoundedRect(f, e, this.blockSize, this.blockSize, 3, colors[6])
            }
    }
    getPosition(n, t) {
        let i = Math.round((n - this.spacing) / (this.spacing + this.blockSize)),
            r = Math.round((t - this.spacing) / (this.spacing + this.blockSize));
        return i >= 0 && i < 9 && r >= 0 && r < 9 ? {
            x: i,
            y: r
        } : null
    }
    enableEdit(n) {
        this.canvas.onclick = n ? n => this.onClick(n) : null
    }
    onClick(n) {
        let t = Math.floor((n.offsetX - this.spacing) / (this.spacing + this.blockSize)),
            i = Math.floor((n.offsetY - this.spacing) / (this.spacing + this.blockSize));
        t >= 0 && t < 9 && i >= 0 && i < 9 && (this.board[i][t] = this.board[i][t] ? 0 : 1, this.draw())
    }
}
