import {Sprite, Vec} from "./Sprite.js"
import {images} from "./ImageLoader.js"
import {SIZE, player} from "./global.js";
import {randomWeight, doTimes} from "./utilities.js";
import { renderSystem } from "./RenderSystem.js";

let tree_list = [];

class GroudDec extends Sprite {
    constructor(paras) {
        super();
        Object.assign(this, paras);
    }

    update(){

    }
}

class Tree extends GroudDec {
    constructor(paras) {
        super({
            image: images.tree,
            size: new Vec(200, 200),
            radius: 20,
        });
        Object.assign(this, paras);
        tree_list.push(this);
    }
}

class Seedling extends GroudDec {
    constructor(paras) {
        super({
            image: images.seedling,
            size: new Vec(50, 50),
            hflip: Math.random() < 0.5
        });
        Object.assign(this, paras);
    }
}

function chooseNearest(p1, x, p2) {
    return (x + x > p1 + p2) ? p2 : p1;
}

class GoundDecManager {
    constructor(){
        this.entities = [];
        this.weights = [5, 25];
        this.types = [Tree, Seedling];
        this.repeat = SIZE.mul(2);
        doTimes(this.spawn.bind(this), 20);
    }

    randomPos(){
        return new Vec(Math.random() * this.repeat.x, Math.random() * this.repeat.y);
    }

    randomType(){
        return this.types[randomWeight(this.weights)];
    }

    spawn(){
        let type = this.randomType();
        let new_dec = new type({
            pos: this.randomPos()
        });
        renderSystem.add(new_dec);
        this.entities.push(new_dec);
        return new_dec;
    }

    update(){
        let x = player.pos.x;
        let y = player.pos.y;
        const w = this.repeat.x;
        const h = this.repeat.y;
        for (const dec of this.entities) {
            const a = Math.floor((x - dec.pos.x) / w) * w + dec.pos.x;
            const b = Math.floor((y - dec.pos.y) / h) * h + dec.pos.y;
            dec.pos.x = chooseNearest(a, x, a + w);
            dec.pos.y = chooseNearest(b, y, b + h);
        }
        this.entities.forEach((i) => {i.update()});
    }
}

let goundDecManager = new GoundDecManager();

export {goundDecManager, tree_list};