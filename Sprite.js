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
}

class Rect {
    constructor(x, y, w, h) {
        this.pos = new Vec(x, y);
        this.size = new Vec(w, h);
    }

    arr() {
        return [this.x, this.y, this.w, this.h];
    }

    move(vec) {
        this.pos = this.pos.add(vec);
    }

    moveTo(target, step) {
        this.move(target.sub(this.pos).normalized().mul(step));
    }
}

class Sprite extends Rect{
    constructor(img_path, x, y, w, h, p_x, p_y) {
        super(x, y, w, h);
        this.image = document.createElement("img");
        this.image.src = img_path;
        if(p_x !== undefined && p_y !== undefined) {
            this.pivot = new Vec(p_x, p_y);
        }
        else {
            this.pivot = new Vec(0.5, 0.5);
        }
    }

    render(ctx) {
        if (!this.image.complete) return;
        ctx.drawImage(this.image, ...this.pos.sub(this.size.mulV(this.pivot)).arr(), ...this.size.arr());
    }
} 

export {Vec, Rect, Sprite};