import {Sprite, Vec} from "./Sprite.js";
import {images} from "./ImageLoader.js"
import {player, SIZE} from "./global.js";
import { randomWeight} from "./utilities.js";

class Enemy extends Sprite {
    constructor(paras) {
        super({
            size: new Vec(100, 100),
            dead: false,
            radius: 40
        });
        Object.assign(this, paras);
    }

    update() {
        this.hp -= this.self_dmg;
        if (this.hp <= 0) {
            this.die();
        }
        super.update();
        this.vel = Vec.zero();
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.hp / this.max_hp * 0.7 + 0.3;
        super.render(ctx);
        ctx.restore();
    }

    die() {
        this.dead = true;
    }

    attack(entity){
        if (entity.effect.type === "diamond" || entity.dead) return;
        entity.hp -= this.dmg;
        this.die();
    }
}

class Devil extends Enemy {
    constructor(paras) {
        super({
            image: images.devil,
            max_hp: 200,
            self_dmg: 0.3,
            dmg: 27,
        });
        this.hp = this.max_hp;
        Object.assign(this, paras);
    }

    update() {
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 2);
        }
        super.update();
    }
}

class Ghost extends Enemy {
    constructor(paras) {
        super({
            image: images.ghost,
            max_hp: 50,
            self_dmg: 0.3,
            dead: false,
            phase: Math.random() * Math.PI,
            dphase: Math.random() * 0.02 - 0.01,
            dmg: 13
        });
        this.hp = this.max_hp;
        Object.assign(this, paras);
    }

    update() {
        this.phase += this.dphase;
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 3);
        }
        this.vel = this.vel.add(Vec.thetaR(this.phase, 7));
        this.hflip = this.vel.x > 0;
        super.update();
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.enemyTypes = [Devil, Ghost];
        this.weights = [6, 4];
        this.last_spawn_time = Date.now();
    }

    randomType() {
        return this.enemyTypes[randomWeight(this.weights)];
    }

    randomPos() {
        const maxr = 600;
        const minr = 300;
        let pos, dist;
        do {
            pos = new Vec(Math.random() * maxr *2 - maxr, Math.random() * maxr * 2 - maxr);
            dist = pos.len();
        } while(dist <= minr && dist <= maxr);
        return pos.add(player.pos);
    }

    spawn() {
        let type = this.randomType();
        let new_enemy = new type({pos: this.randomPos()});
        this.enemies.push(new_enemy);
        return new_enemy;
    }

    update() {
        if (Date.now() - this.last_spawn_time > 1000) {
            this.spawn();
            this.last_spawn_time = Date.now();
        }
        for (let i = 0; i < this.enemies.length; ++i) {
            const enemy = this.enemies[i];
            if (enemy.dead) {
                this.enemies.splice(i, 1);
            }
            else {
                enemy.update();
            }
        }
    }
}

export {Devil, Ghost, EnemyManager};