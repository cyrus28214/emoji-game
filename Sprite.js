class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalized() {
        let len = this.length();
        return this.div(len);
    }

    arr() {
        return [this.x, this.y];
    }

    add(vec) {
        return new Vec(this.x + vec.x, this.y + vec.y);
    }

    sub(vec) {
        return new Vec(this.x - vec.x, this.y - vec.y);
    }

    mul(c) {
        return new Vec(this.x * c, this.y * c);
    }

    mulV(vec) {
        return new Vec(this.x * vec.x, this.y * vec.y);
    }

    div(c) {
        return new Vec(this.x / c, this.y / c);
    }

    divV(vec) {
        return new Vec(this.x / vec.x, this.y / vec.y);
    }

    dist(vec) {
        return this.sub(vec).length();
    }

    in(rect) {
        return this.x >= rect.left() &&
            this.x <= rect.right() &&
            this.y >= rect.top() &&
            this.y <= rect.bottom();
    }
}

class Rect {
    constructor(pos, size, pivot) {
        this.pos = pos;
        this.size = size;
        this.pivot = pivot || new Vec(0, 0);
    }

    left() {
        return this.pos.x - this.size.x * this.pivot.x;
    }

    right() {
        return this.pos.x + this.size.x * (1 - this.pivot.x);
    }

    top() {
        return this.pos.y - this.size.y * this.pivot.y;
    }

    bottom() {
        return this.pos.y + this.size.y * (1 - this.pivot.y);
    }

    move(vec) {
        this.pos = this.pos.add(vec);
    }

    moveTo(target, step) {
        this.move(target.sub(this.pos).normalized().mul(step));
    }

    render(ctx) {
        this.fillRect(this.left(), this.top(), ...this.size.arr());
    }
}

class Sprite extends Rect{
    constructor(img_path, pos, size, pivot) {
        super(pos, size, pivot || new Vec(0.5, 0.5));
        this.image = document.createElement("img");
        this.image.src = img_path;
    }

    render(ctx) {
        if (!this.image.complete) return;
        ctx.drawImage(this.image, 
            this.left(),
            this.top(),
            ...this.size.arr());
    }
} 

export {Vec, Rect, Sprite};