import {Vec, Rect, Sprite} from "./Sprite.js";
import {images} from "./ImageLoader.js";
import { Effect } from "./Item.js";
import { renderSystem } from "./RenderSystem.js";

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
            effect: Effect.Null(),
        })
        this.hp = this.max_hp;
    }

    die() {
        this.image = images.turtle_die;
        this.dead = true;
    }

    update() {
        if (this.hp <= 0) {
            this.die();
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
                this.vel = Vec.pointsR(SIZE.div(2), mpos, 3);
            }
            this.hflip = mpos.x > SIZE.x / 2;
            this.move(this.vel);
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
        this.pos = new Vec(document.innerWidth / 2, document.innerWidth / 2);
        document.addEventListener("mousemove", this.mouseMove.bind(this));
        document.addEventListener("touchmove", this.touchStart.bind(this), {passive: false});
        document.addEventListener("touchstart", this.touchMove.bind(this), {passive: false});
        document.addEventListener("touchend", this.touchEnd.bind(this), {passive: false});
    }

    update(e) {
        let rect = canvas.getBoundingClientRect();
        this.pos.x = (e.clientX - rect.left) * canvas.width / rect.width;
        this.pos.y = (e.clientY - rect.top) * canvas.height / rect.height;
    }

    mouseMove(event) {
        this.update(event);
    }

    touchEnd(event) {
        player.noMove();
        event.cancelable && event.preventDefault();
        this.update(event.touches[0]);
    }

    touchStart(event) {
        player.startMove();
        event.cancelable && event.preventDefault();
        this.update(event.touches[0]);
    }

    touchMove(event) {
        event.cancelable && event.preventDefault();
        this.update(event.touches[0]);
    }
}

let player = new Player();
renderSystem.add(player);
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