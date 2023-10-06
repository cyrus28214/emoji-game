import {Sprite, Vec} from "./Sprite.js";
import {images} from "./ImageLoader.js"
import {player, SIZE, totalTick} from "./global.js";
import { delIfTagged, getLerp, getLiner, randomWeight } from "./utilities.js";
import { ColCC, collisionSystem } from "./Collision.js";
import { renderSystem } from "./RenderSystem.js";
import { goundDecManager } from "./GoundDec.js";

class Enemy extends Sprite {
    constructor(paras) {
        super({
            size: new Vec(100, 100),
            radius: 40
        });
        Object.assign(this, paras);
        this.col_event = collisionSystem.add(ColCC, player, this, () => {this.attack(player);});
    }

    update() {
        this.hp -= this.self_dmg;
        if (this.hp <= 0) {
            this.die();
        }
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.hp / this.max_hp * 0.9 + 0.1;
        super.render(ctx);
        ctx.restore();
    }

    die() {
        this.del();
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
        super.update();
        this.vel = Vec.zero();
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 2);
        }
        this.move(this.vel);
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
        super.update();
        this.phase += this.dphase;
        this.vel = Vec.zero();
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 3);
        }
        this.vel = this.vel.add(Vec.thetaR(this.phase, 7));
        this.hflip = this.vel.x > 0;
        this.move(this.vel);
    }
}

class Robot extends Enemy {
    constructor(paras) {
        super({
            image: images.robot,
            max_hp: 300,
            self_dmg: 0.3,
            dmg: 21,
        });
        this.hp = this.max_hp;
        this.tar = null;
        Object.assign(this, paras);
    }

    getNextTar() {
        let dx = Math.abs(this.pos.x - player.pos.x);
        let dy = Math.abs(this.pos.y - player.pos.y);
        this.tar = dx > dy ? new Vec(player.pos.x, this.pos.y) : new Vec(this.pos.x, player.pos.y);
    }

    update() {
        if (this.tar === null ||
            this.pos.dist(this.tar) < 10) {
                this.getNextTar();
        }
        super.update();
        this.vel = Vec.zero();
        this.velTo(this.tar, 3);
        this.move(this.vel);
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.enemyTypes = [Devil, Robot, Ghost];
        this.getWeights = [
            () => { return 10; },
            getLerp(0, 0, 1000, 10),
            getLerp(1000, 0, 2000, 10),
        ];
        this.weights = [];
        this.time = 0;
    }

    liner = getLiner(0.01, 10)

    nextSpawnTime() {
        return Math.floor(1000 / this.liner(totalTick));
    }

    randomType() {
        console.log(randomWeight(this.weights));
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
        renderSystem.add(new_enemy);
        this.enemies.push(new_enemy);
        return new_enemy;
    }

    update() {
        this.weights = this.getWeights.map(f => { return f(totalTick); });
        if (this.time === 0) {
            this.spawn();
            this.time = this.nextSpawnTime();
        }
        this.time -= 1;
        this.enemies = delIfTagged(this.enemies);
        this.enemies.forEach( (i) => {i.update()});
    }
}

let enemyManager = new EnemyManager();

export {Devil, Ghost, enemyManager};