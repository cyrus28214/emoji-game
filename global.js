import {Vec, Rect, Sprite} from "./Sprite.js";
import {images} from "./ImageLoader.js"

let canvas;
let ctx;

const SIZE = new Vec(900, 1600);
const RECT = new Rect(new Vec(0, 0), SIZE);

class Player extends Sprite {
    constructor() {
        super(images.turtle, new Vec(0, 0), new Vec(100, 100));
        this.max_hp = 100;
        this.hp = this.max_hp;
    }

    update() {
        let mpos = mouseInput.pos;
        if (this.pos.dist(mpos) > 50) {
            this.velTo(mpos, 3);
        }
        this.hflip = mpos.x > this.pos.x;
        super.update();
        this.vel = Vec.zero();
    }

    render() {
        super.render(ctx);
    }
}

class MouseInput {
    constructor(){
        this.pos = SIZE.div(2);
        document.addEventListener("mousemove", this.update.bind(this));
    }

    update(event) {
        let rect = canvas.getBoundingClientRect();
        this.pos.x = (event.clientX - rect.left) * (canvas.width / rect.width);
        this.pos.y = (event.clientY - rect.top) * (canvas.height / rect.height);
        this.pos = this.pos.sub(SIZE.div(2)).add(player.pos);
    }
}

let player = new Player();
let mouseInput = new MouseInput();

function resetDisplay() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let aspect_ratio = SIZE.x / SIZE.y;
    if (w / h > aspect_ratio) {
        canvas.style.height = h + "px";
        canvas.style.width = h * aspect_ratio+ "px";
    }
    else {
        canvas.style.width = w+ "px";
        canvas.style.height = w / aspect_ratio + "px";
    }
}

function main() {
    canvas = document.getElementById("canvas");
    canvas.width = SIZE.x
    canvas.height = SIZE.y;
    resetDisplay();
    window.addEventListener("resize", resetDisplay);
    ctx = canvas.getContext("2d");
}

document.addEventListener("DOMContentLoaded", main);

export {canvas, ctx, SIZE, RECT, player, mouseInput}; 