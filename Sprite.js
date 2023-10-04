class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static thetaR(theta, r) {
        return new Vec(Math.cos(theta) * r, Math.sin(theta) * r);
    }

    static pointsR(v1, v2, r) {
        return new Vec(v2.x - v1.x, v2.y - v1.y).nor().mul(r);
    }

    static fromTo(v1, v2) {
        return v2.sub(v1);
    }

    static zero() {
        return new Vec(0, 0);
    }

    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    nor() {
        let len = this.len();
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
        return this.sub(vec).len();
    }

    in(rect) {
        return this.x >= rect.left() &&
            this.x <= rect.right() &&
            this.y >= rect.top() &&
            this.y <= rect.bottom();
    }
    
    oppo() {
        return new Vec(-this.x, -this.y);
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
}

class Sprite extends Rect{
    constructor(img, pos, size, pivot) {
        super(pos, size, pivot || new Vec(0.5, 0.5));
        this.image = img;
        this.hflip = false;
        this.vel = new Vec(0, 0);
    }

    velTo(targetPos, step) {
        this.vel = this.vel.add(Vec.pointsR(this.pos, targetPos, step));
    }
    
    update() {
        this.move(this.vel);
    }

    render(ctx) {
        if (!this.image.complete) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        if (this.hflip) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(this.image, -this.size.x * this.pivot.x, -this.size.y * this.pivot.y, ...this.size.arr());
        ctx.restore();
    }
} 

export {Vec, Rect, Sprite};