import { images } from "./ImageLoader.js";
import { Sprite, Vec } from "./Sprite.js";
import { SIZE, mouseInput, player, totalTick } from "./global.js";

class Heart extends Sprite{
    constructor(paras) {
        super({
            image: images.heart,
            pos: new Vec(0, 0),
            pivot: new Vec(0, 0),
            size: new Vec(50, 50)
        });
        Object.assign(this, paras);
    }
}

class HpBar{
    constructor(paras) {
        Object.assign(this, {
            margin: 30,
            max_heart: 5,
            pos: new Vec(50, 50),
            heart: new Heart()
        }, paras);
        this.heartcnt = this.entity.hp / this.entity.max_hp * this.max_heart;
        this.full = this.max_heart;
        this.last_opacity = 1.0;
    }

    update() {
        this.heart.image = images[{
            "diamond":"diamond",
            "heal":"heart_heal",
            "devil":"purple_heart",
        }[this.entity.effect.type]];
        if (this.heart.image === undefined)
            this.heart.image = images.heart;
        this.heartcnt = this.entity.hp / this.entity.max_hp * this.max_heart;
        this.full = Math.floor(this.heartcnt);
        this.last_opacity = this.heartcnt % 1;
    }

    render(ctx) {
        if (this.entity.hp <= 0) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        for (let i = 0; i < this.full; ++i) {
            this.heart.render(ctx);
            ctx.translate(this.margin + this.heart.size.x, 0);
        }
        if (this.last_opacity > 0) {
            ctx.globalAlpha = this.last_opacity;
            this.heart.render(ctx);
        }
        ctx.restore();
    }
}

class ScoreBoard {
    constructor(paras) {
        Object.assign(this, {
            sc: 0,
            pos: new Vec(SIZE.x - 50, 100)
        }, paras);
    }

    update() {
        this.sc = totalTick;
    }

    render(ctx) {
        ctx.save();
        const text = this.sc.toString();
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        ctx.font = "64px sans-serif";
        ctx.translate(this.pos.x - ctx.measureText(text).width, this.pos.y);
        ctx.fillText(text, 0, 0);
        ctx.strokeText(text, 0, 0);
        ctx.restore();
    }
}

class RestartButton extends Sprite{
    constructor(paras) {
        super({
            pos: new Vec(SIZE.x / 2, SIZE.y / 3 * 2),
            pivot: new Vec(0.5, 0.5),
            size: new Vec(250, 250),
            image: images.tick
        });
        Object.assign(this, paras);
        document.addEventListener("click", this.click.bind(this));
        document.addEventListener("touchend", this.click.bind(this));
    }

    update() {
        if (mouseInput.pos.in(this)) {
            this.size = new Vec(300, 300);
        }
        else {
            this.size = new Vec(250, 250);
        }
    }

    click() {
        if (mouseInput.pos.in(this) && player.dead) {
            location.reload();
        }
    }
}

export {HpBar, ScoreBoard, RestartButton};