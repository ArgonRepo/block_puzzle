'use strict';

class canvas {
    ctx = null;
    constructor(canvasId, width, height, backgroundColor) {
        this.canvas = document.getElementById(canvasId);
        this.backgroundColor = backgroundColor;
        this.initCanvas(width, height);
        this.width = width;
        this.height = height;
    }

    //	this.selector.addEventListener('click', event => this.onMouseClick(event));

    initCanvas(width, height) {
        // Set display size (css pixels).  
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        // Set actual size in memory (scaled to account for extra pixel density).
        // Change to 1 on retina screens to see blurry canvas.
        const scale = window.devicePixelRatio;
        this.canvas.width = Math.floor(width * scale);
        this.canvas.height = Math.floor(height * scale);

        // Normalize coordinate system to use css pixels.
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(scale, scale);

        // Clear previous drawing.
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //this.ctx.strokeStyle = 'rgba(200, 200, 200, 1)';
        //this.ctx.lineWidth = 3;
        //this.ctx.font = '28px sans-serif'
        //this.ctx.textAlign = 'center'
        //this.ctx.textBaseline = 'top'
    }

    setPosition(x, y, zIndex) {
        this.canvas.style.left = x + 'px';
        this.canvas.style.top = y + 'px';
        this.canvas.style.zIndex = zIndex;
    }

    resize(left, top, width, height, zIndex) {
        this.setPosition(left, top, zIndex);
        this.initCanvas(width, height);
    }

    drawRoundedRect(x, y, width, height, radius, color) {
        // 先绘制一个普通的矩形  
        //context.beginPath();  
        //context.rect(x, y, width, height);  
        //context.closePath();  

        // 绘制圆角  
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.arc(x + width - radius, y + radius, radius, Math.PI / 2, 0);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
        this.ctx.lineTo(x, y + radius);
        this.ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI / 2);
        this.ctx.closePath();

        // 填充颜色  
        this.ctx.fillStyle = color; // 你可以改变这个颜色  
        this.ctx.fill();
    }

    isPointInRectangle(rectX, rectY, rectWidth, rectHeight, x, y) {
        let x2 = rectX + rectWidth - 1;
        let y2 = rectY + rectHeight - 1;
        if (x < rectX || x > x2 || y < rectY || y > y2)
            return false;
        else
            return true;
    }

    clear(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    set show(isVisible) {
        // 设置是否可见
        this.canvas.style.display = isVisible ? 'block' : 'none';
    }
}