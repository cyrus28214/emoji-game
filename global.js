import {Vec, Rect, Sprite} from "./Sprite.js";
import {images} from "./ImageLoader.js";
import { Effect } from "./Item.js";

let canvas;
let ctx;

const SIZE = new Vec(900, 1600);
const RECT = new Rect(new Vec(0, 0), SIZE);

class Player extends Sprite {
    constructor() {
        super({
            movable: true,
            image: images.turtle,
            pos: new Vec(0, 0),
            size: new Vec(100, 100),
            max_hp: 100,
            radius: 40,
            effect: Effect.Null()
        })
        this.hp = this.max_hp;
    }

    update() {
        if (this.hp <= 0) {
            this.dead = true;
        }

        if (this.dead) {
            this.image = images.turtle_die;
            return;
        }

        if (this.effect.time === 0) {
            this.effect = Effect.Null();
        }
        else {
            this.effect.time -= 1;
        }
        
        this.image = images[{
            "null": "turtle",
            "diamond": "turtle_diamond",
            "heal": "turtle_delicious"
        }[this.effect.type]];

        if (this.effect.type === "heal") {
            this.hp += 20 / 300;
            this.hp = Math.min(this.hp, this.max_hp);
        }

        if (this.movable) {
            let mpos = mouseInput.pos;
            if (this.pos.dist(mpos) > 50) {
                this.velTo(mpos, 3);
            }
            this.hflip = mpos.x > this.pos.x;
            super.update();
            this.vel = Vec.zero();
        }
    }

    noMove() {
        this.movable = false;
    }

    startMove() {
        this.movable = ! this.dead;
    }

    render() {
        super.render(ctx);
    }
}

class MouseInput {
    constructor(){
        this.pos = Vec.zero();
        this.mpos = new Vec(document.innerWidth / 2, document.innerWidth / 2);
        document.addEventListener("mousemove", this.mouseMove.bind(this));
        document.addEventListener("touchmove", this.touchStart.bind(this), {passive: false});
        document.addEventListener("touchstart", this.touchMove.bind(this), {passive: false});
        document.addEventListener("touchend", this.touchEnd.bind(this), {passive: false});
    }

    update() {
        let rect = canvas.getBoundingClientRect();
        this.pos.x = (this.mpos.x - rect.left) * (canvas.width / rect.width);
        this.pos.y = (this.mpos.y - rect.top) * (canvas.height / rect.height);
        this.pos = this.pos.sub(SIZE.div(2)).add(player.pos);
    }

    mouseMove(event) {
        this.mpos.x = event.clientX;
        this.mpos.y = event.clientY;
    }

    touchEnd(event) {
        player.noMove();
        event.cancelable && event.preventDefault();
    }

    touchStart(event) {
        player.startMove();
        event.cancelable && event.preventDefault();
        this.mpos.x = event.touches[0].clientX;
        this.mpos.y = event.touches[0].clientY;
    }

    touchMove(event) {
        event.cancelable && event.preventDefault();
        this.mpos.x = event.touches[0].clientX;
        this.mpos.y = event.touches[0].clientY;
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