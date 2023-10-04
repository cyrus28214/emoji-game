import {Sprite} from "./Sprite.js"
import {images} from "./ImageLoader.js"
import {SIZE} from "./global.js";

class GroudDec extends Sprite {
    constructor(img) {
        super(img, pos, new Vec(100, 100));
    }
}

class GoundDecManager {
    constructor(){
        this.entities = [];
        this.weights = [5];
        this.images = [images.tree];
        this.repeat = SIZE.mul(2);
    }

    randomPos(){
        let pos = new Vec(Math.random() * this.repeat.x, Math.random() * this.repeat.y);
    } 
}

// class Player extends Sprite {
//     constructor() {
//         super(images.turtle, new Vec(0, 0), new Vec(100, 100));
//         this.max_hp = 100;
//         this.hp = this.max_hp;
//     }

//     update() {
//         let mpos = mouseInput.pos;
//         if (this.pos.dist(mpos) > 50) {
//             this.velTo(mpos, 3);
//         }
//         this.hflip = mpos.x > this.pos.x;
//         super.update();
//         this.vel = Vec.zero();
//     }

//     render() {
//         super.render(ctx);
//     }
    
// }