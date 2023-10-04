import {Vec, Rect, Sprite} from "./Sprite.js";
import { lastElement, thetaR} from "./ultilities.js";

let canvas;
let ctx;

const SIZE = new Vec(1600, 1200);
const RECT = new Rect(new Vec(0, 0), SIZE);

class Player extends Sprite {
    constructor() {
        super("./images/turtle.png", SIZE.div(2), new Vec(200, 200));
        this.max_health = 100;
        this.health = this.max_health;
    }

    update() {
        if (this.pos.dist(mouseInput.pos) > 50) {
            this.moveTo(mouseInput.pos, 7);
        }
        this.render(ctx);
    }
}

class Devil extends Sprite {
    constructor(pos) {
        super("./images/devil.png", pos, new Vec(200, 200));
        this.max_health = 200;
        this.health = this.max_health;
    }

    update() {
        if (this.pos.dist(player.pos) > 50) {
            this.moveTo(player.pos, 1);
        }
        this.render(ctx);
    }
}

class Ghost extends Sprite {
    constructor(pos) {
        super("./images/ghost.png", pos, new Vec(200, 200));
        this.max_health = 50;
        this.health = this.max_health;
        this.phase = Math.random() * Math.PI;
    }

    update() {
        this.phase += 0.01;
        if (this.pos.dist(player.pos) > 50) {
            this.moveTo(player.pos, 3);
            this.move(thetaR(this.phase, 5));
        }
        this.render(ctx);
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.enemyWeights = [{type: Devil, weight: 7}, {type: Ghost, weight: 3}];
        this.totalWeight = 0;
        for (const enemy of this.enemyWeights) {
            this.totalWeight += enemy.weight;
        }
        this.last_spawn_time = Date.now();
    }

    randomType() {
        let r = Math.random() * this.totalWeight;
        for (const enemy of this.enemyWeights) {
            if (r <= enemy.weight) {
                return enemy.type;
            }
            r -= enemy.weight;
        }
        return lastElement(this.enemyWeights).type;
    }

    randomPos() {
        let pos;
        do {
            pos = new Vec(Math.random() * SIZE.x, Math.random() * SIZE.y);
        } while(pos.dist(player.pos) <= 400);
        return pos;
    }

    spawn() {
        let type = this.randomType();
        let pos = this.randomPos();
        this.enemies.push(new type(pos));
    }

    update() {
        if (Date.now() - this.last_spawn_time > 2000) {
            this.spawn();
            this.last_spawn_time = Date.now();
        }
        for (const enemy of this.enemies) {
            enemy.update();
        }
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
let enemyManager = new EnemyManager();
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
    enemyManager.update();
    player.update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", main);

console.log(player);
console.log(mouseInput);


