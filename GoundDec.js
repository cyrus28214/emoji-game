import {Sprite, Vec} from "./Sprite.js"
import {images} from "./ImageLoader.js"
import {SIZE, player} from "./global.js";
import {randomWeight, doTimes} from "./utilities.js";

class GroudDec extends Sprite {
    constructor(img, pos, size) {
        super(img, pos, size);
    }
}

class Tree extends GroudDec {
    constructor(pos) {
        super(images.tree, pos, new Vec(200, 200));
    }
}

class Seedling extends GroudDec {
    constructor(pos) {
        super(images.seedling, pos, new Vec(50, 50));
        this.hflip = Math.random() < 0.5;
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
        let pos = this.randomPos();
        let type = this.randomType();
        let new_dec = new type(pos);
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
    }
}

export {GoundDecManager};