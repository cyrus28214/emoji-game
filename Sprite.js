import { renderSystem } from "./RenderSystem.js";

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

class Rect{
    constructor(paras) {
        this.pivot = Vec.zero();
        Object.assign(this, paras);
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
    constructor(paras) {
        super({
            hide: false,
            hflip: false,
            vel: Vec.zero(),
            pivot: new Vec(0.5, 1),
            del_tag: false
        });
        Object.assign(this, paras);
    }

    velTo(targetPos, step) {
        this.vel = this.vel.add(Vec.pointsR(this.pos, targetPos, step));
    }
    
    update() {
        this.move(this.vel);
    }

    render(ctx) {
        if (!this.image.complete || this.hide) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        if (this.hflip) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(this.image, -this.size.x * this.pivot.x, -this.size.y * this.pivot.y, ...this.size.arr());
        ctx.restore();
    }

    del() {
        this.del_tag = true;
    }
} 

export {Vec, Rect, Sprite};