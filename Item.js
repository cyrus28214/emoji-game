import { Vec, Sprite } from "./Sprite.js";
import { delIfTagged, randomWeight } from "./utilities.js";
import { player } from "./global.js";
import { images } from "./ImageLoader.js";
import { ColCC, collisionSystem } from "./Collision.js";
import { renderSystem } from "./RenderSystem.js";

//
class Effect {
    static Null() {
        return new Effect({
            type: "null",
            time: -1
        })
    }

    constructor(paras) {
        Object.assign(this, {
            time: 300
        }, paras);
    }
}

class Item extends Sprite {
    constructor(paras) {
        super({
            time: 360, 
            blink_time: 60,
            size: new Vec(50, 50),
            radius: 25
        })
        Object.assign(this, paras);
        this.col_event = collisionSystem.add(ColCC, player, this, () => {this.addEff(player)});
    }

    update() {
        this.time -= 1;
        if (this.time <= 0) {
            this.del();
        }
        else if (this.time < this.blink_time) {
            this.hide = this.time % 10 > 5;
        }
    }

    addEff(e){
        this.del();
        e.effect = this.effect;
    }
}

class Diamond extends Item {
    constructor(paras) {
        super({
            image: images.diamond,
            effect: new Effect({type: "diamond"})
        })
        Object.assign(this, paras);
    }
}

class Apple extends Item {
    constructor(paras) {
        super({
            image: images.apple,
            effect: new Effect({type: "heal"})
        })
        Object.assign(this, paras);
    }
}

class PurpleHeart extends Item {
    constructor(paras) {
        super({
            image: images.purple_heart_rect,
            effect: new Effect({type: "devil", time: 1200})
        })
        Object.assign(this, paras);
    }
}

class ItemManager {
    constructor() {
        this.entities = [];
        this.types = [Diamond, Apple, PurpleHeart];
        this.weights = [6, 3, 1];
        this.time = 120;
    }

    randomType() {
        return this.types[randomWeight(this.weights)];
    }

    randomPos() {
        const maxr = 800;
        const minr = 300;
        let pos, dist;
        do {
            pos = new Vec(Math.random() * maxr * 2 - maxr, Math.random() * maxr * 2 - maxr);
            dist = pos.len();
        } while(dist <= minr && dist <= maxr);
        return pos.add(player.pos);
    }

    spawn() {
        let type = this.randomType();
        let new_entity = new type({pos: this.randomPos()});
        renderSystem.add(new_entity);
        this.entities.push(new_entity);
        return new_entity;
    }

    update() {
        --this.time;
        if (this.time === 0) {
            this.spawn();
            this.time = 120;
        }
        this.entities = delIfTagged(this.entities);
        this.entities.forEach((i) => {i.update()});
    }
}

const itemManager = new ItemManager();

export {itemManager, Effect};