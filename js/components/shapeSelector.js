class shapeSelector extends canvas {
    constructor(n, t) {
        super(n, t, t, "black");
        this.frameWidth = 2;
        this.shapePos = null;
        this.enable = !0;
        this.roundSelected = [];
        this.highlightShape = null;
        this.lineCount = Math.round(Math.sqrt(shapes.length) + .5);
        this.shapeSize = Math.floor(t / this.lineCount);
        this.spacing = 1;
        this.blockSize = Math.floor((this.shapeSize - this.frameWidth * 2) / 5 - this.spacing);
        this.shapes = shapes;
        for (var i = 0; i < this.shapes.length; i++) this.shapes[i].id = i;
        this.canvas.addEventListener("click", n => this.onMouseClick(n));
        this.canvas.addEventListener("mouseout", n => this.onMouseOut(n));
        this.canvas.addEventListener("mousemove", n => this.onMouseMove(n))
    }
    draw() {
        var n, i, r, t;
        let u = this.shapePos === null;
        for (u && (this.shapePos = []), n = 0; n < this.shapes.length; n++) {
            let o = n % this.lineCount,
                s = Math.floor(n / this.lineCount);
            i = o * this.shapeSize;
            r = s * this.shapeSize;
            let f = getSize(shapes[n].w, this.blockSize, this.spacing),
                e = getSize(shapes[n].h, this.blockSize, this.spacing);
            i += Math.floor((this.shapeSize - f) / 2) + this.spacing;
            r += Math.floor((this.shapeSize - e) / 2) + this.spacing;
            this.drawShape(i, r, shapes[n], colors[shapes[n].c]);
            u && (t = {}, t.x = i, t.y = r, t.width = f, t.height = e, t.shape = shapes[n], this.shapePos.push(t))
        }
    }
    drawShape(n, t, i, r) {
        for (var f, u = 0; u < i.h; u++)
            for (f = 0; f < i.w; f++) {
                let e = n + (this.spacing + this.blockSize) * f,
                    o = t + (this.spacing + this.blockSize) * u;
                i.s[u * i.w + f] && this.drawRoundedRect(e, o, this.blockSize, this.blockSize, 2, r)
            }
    }
    clearSelect() {
        this.roundSelected = []
    }
    findShapeAtPos(n, t) {
        for (var i = 0; i < this.shapePos.length; i++) {
            let r = this.shapePos[i];
            if (this.isPointInRectangle(r.x, r.y, r.width, r.height, n, t)) return r
        }
        return null
    }
    onMouseClick(n) {
        if (this.enable !== !1 && this.shapePos !== null) {
            const i = n.offsetX,
                r = n.offsetY;
            let t = this.findShapeAtPos(i, r);
            if (t) {
                this.roundSelected.length >= 3 && this.roundSelected.shift();
                this.roundSelected.push(t);
                var n = new CustomEvent("SelectedShapeChanged", {
                    detail: this.roundSelected
                });
                this.canvas.dispatchEvent(n)
            }
        }
    }
    onMouseOut() {
        this.enable !== !1 && this.clearHighlight()
    }
    clearHighlight() {
        this.highlightShape && (this.drawShape(this.highlightShape.x, this.highlightShape.y, this.highlightShape.shape, colors[this.highlightShape.shape.c]), this.highlightShape = null)
    }
    onMouseMove(n) {
        if (this.enable !== !1) {
            var i = n.target.getBoundingClientRect(),
                r = n.clientX - i.left,
                u = n.clientY - i.top;
            let t = this.findShapeAtPos(r, u);
            if (t) {
                if (this.highlightShape) {
                    if (this.highlightShape == t) return;
                    this.drawShape(this.highlightShape.x, this.highlightShape.y, this.highlightShape.shape, colors[this.highlightShape.shape.c])
                }
                this.highlightShape = t;
                this.drawShape(t.x, t.y, t.shape, colors[9]);
                return
            }
            this.clearHighlight()
        }
    }
    addSelectedShapeChangedEventListener(n) {
        this.canvas.addEventListener("SelectedShapeChanged", n)
    }
}
class roundShape extends canvas {
    constructor(n, t, i) {
        super(n, t, i, "rgba(32, 32, 32, 255)");
        this.spacing = 3;
        this.lineCount = 3;
        this.frameWidth = 4;
        this.selectedShape = [];
        this.colWidth = Math.floor((t - 2 * this.frameWidth) / this.lineCount);
        this.colHeight = i - 2 * this.frameWidth;
        let r = Math.min(Math.floor(t / this.lineCount), i) - (this.spacing + this.frameWidth) * 2;
        this.blockSize = Math.floor(r / 5) - this.spacing
    }
    draw(n) {
        var t, i, r;
        for (this.clear(this.backgroundColor), this.selectedShape = [], t = 0; t < n.length; t++) {
            i = this.frameWidth + t * this.colWidth;
            r = this.frameWidth;
            let u = n[t],
                f = getSize(u.w, this.blockSize, this.spacing),
                e = getSize(u.h, this.blockSize, this.spacing);
            i += Math.floor((this.colWidth - f) / 2);
            r += Math.floor((this.colHeight - e) / 2);
            this.drawShape(i, r, u);
            this.selectedShape.push(u)
        }
    }
    getSelectedShape() {
        return this.selectedShape
    }
    drawShape(n, t, i) {
        for (var u, r = 0; r < i.h; r++)
            for (u = 0; u < i.w; u++) {
                let f = n + (this.spacing + this.blockSize) * u,
                    e = t + (this.spacing + this.blockSize) * r;
                i.s[r * i.w + u] && this.drawRoundedRect(f, e, this.blockSize, this.blockSize, 2, colors[i.c])
            }
    }
}
