import {Vec, Rect, Sprite} from "./Sprite.js";

let canvas;
let ctx;

let SIZE = new Vec(1600, 1200);


class Player extends Sprite{
    constructor() {
        super("./images/turtle.png", ...SIZE.div(2).arr(), 200, 200);
        this.max_health = 100;
        this.health = this.max_health;
    }

    update() {
        if (this.pos.sub(mouseInput.pos).length() > 50) {
            this.moveTo(mouseInput.pos, 5);
        }
        this.render(ctx);
    }
}

class Devil extends Sprite{
    constructor() {
        super("./images/devil.png", ...SIZE.div(3).arr(), 200, 200);
        this.max_health = 200;
        this.health = this.max_health;
    }

    update() {
        if (this.pos.sub(player.pos).length() > 50) {
            this.moveTo(player.pos, 1);
        }
        this.render(ctx);
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
    }
}

let player = new Player();
let devil = new Devil();
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
    gameLoop();
}

function gameLoop() {
    ctx.clearRect(0, 0, ...SIZE.arr());
    devil.update();
    player.update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", main);

console.log(player);
console.log(mouseInput);


