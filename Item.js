import { Vec, Sprite } from "./Sprite.js";
import { randomWeight } from "./utilities.js";
import { player } from "./global.js";
import { images } from "./ImageLoader.js";

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
            delete_tag: false,
            time: 300, 
            blink_time: 60,
            size: new Vec(50, 50),
            radius: 25
        })
        Object.assign(this, paras);
    }

    update() {
        this.time -= 1;
        if (this.time <= 0) {
            this.delete_tag = true;
        }
        else if (this.time < this.blink_time) {
            this.hide = this.time % 10 > 5;
        }
    }

    addEff(e){
        this.delete_tag = true;
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

class ItemManager {
    constructor() {
        this.entities = [];
        this.types = [Diamond];
        this.weights = [6];
        this.last_spawn_time = Date.now();
    }

    randomType() {
        return this.types[randomWeight(this.weights)];
    }

    randomPos() {
        const maxr = 1000;
        const minr = 200;
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
        this.entities.push(new_entity);
        return new_entity;
    }

    update() {
        if (Date.now() - this.last_spawn_time > 2000) {
            this.spawn();
            this.last_spawn_time = Date.now();
        }
        for (let i = 0; i < this.entities.length; ++i) {
            const entities = this.entities[i];
            if (entities.delete_tag) {
                this.entities.splice(i, 1);
            }
            else {
                entities.update();
            }
        }
    }
}

export {ItemManager, Effect};