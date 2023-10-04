import {Sprite, Vec} from "./Sprite.js";
import {images} from "./ImageLoader.js"
import {player} from "./global.js";

class Enemy extends Sprite {
    constructor(img, pos, max_hp, self_dam) {
        super(img, pos, new Vec(100, 100));
        this.player = player;
        this.max_hp = max_hp;
        this.hp = this.max_hp;
        this.self_dam = self_dam;
        this.dead = false;
    }

    update() {
        this.hp -= this.self_dam;
        if (this.hp <= 0) {
            this.dead = true;
            this.die();
        }
        super.update();
        this.vel = Vec.zero();
    }

    render(ctx) {
        ctx.globalAlpha = this.hp / this.max_hp * 0.7 + 0.3;
        super.render(ctx);
        ctx.globalAlpha = 1.0;
    }

    die() {

    }
}

class Devil extends Enemy {
    constructor(pos) {
        super(images.devil, pos, 200, 0.2);
    }

    update() {
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 2);
        }
        super.update();
    }
}

class Ghost extends Enemy {
    constructor(pos) {
        super(images.ghost, pos, 50, 0.2);
        this.phase = Math.random() * Math.PI;
    }

    update() {
        this.phase += 0.01;
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 5);
        }
        this.vel = this.vel.add(Vec.thetaR(this.phase, 7));
        this.hflip = this.vel.x > 0;
        super.update();
    }
}

export {Devil, Ghost};