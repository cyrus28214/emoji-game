import {Vec, Rect, Sprite} from "./Sprite.js";
import {lastElement} from "./utilities.js";

let canvas;
let ctx;

const SIZE = new Vec(900, 1600);
const RECT = new Rect(new Vec(0, 0), SIZE);

class Player extends Sprite {
    constructor() {
        super("./images/turtle.png", new Vec(0, 0), new Vec(100, 100));
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

class Enemy extends Sprite {
    constructor(img_path, pos, max_hp, self_dam) {
        super(img_path, pos, new Vec(100, 100));
        this.max_hp = max_hp;
        this.hp = this.max_hp;
        this.self_dam = self_dam;
        this.dead = false;
    }

    update() {
        this.hp -= this.self_dam;
        if (this.hp <= 0) {
            this.dead = true;
            this.die();
        }
        super.update();
        this.vel = Vec.zero();
    }

    render() {
        ctx.globalAlpha = this.hp / this.max_hp * 0.7 + 0.3;
        super.render(ctx);
        ctx.globalAlpha = 1.0;
    }

    die() {

    }
}

class Devil extends Enemy {
    constructor(pos) {
        super("./images/devil.png", pos, 200, 0.3);
    }

    update() {
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 2);
        }
        super.update();
    }
}

class Ghost extends Enemy {
    constructor(pos) {
        super("./images/ghost.png", pos, 50, 0.3);
        this.phase = Math.random() * Math.PI;
    }

    update() {
        this.phase += 0.03;
        if (this.pos.dist(player.pos) > 50) {
            this.velTo(player.pos, 3);
        }
        this.vel = this.vel.add(Vec.thetaR(this.phase, 5));
        this.hflip = this.vel.x > 0;
        super.update();
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
        for (let i = 1; i < this.enemies.length; ++i) {
            const enemy = this.enemies[i];
            if (enemy.dead) {
                this.enemies.splice(i, 1);
            }
            else {
                enemy.update();
            }
        }
    }

    render() {
        for (const enemy of this.enemies) {
            enemy.render();
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
        this.pos = this.pos.sub(SIZE.div(2)).add(player.pos);
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
    console.log(ctx);
    gameLoop();
}

function gameLoop() {
    enemyManager.update();
    player.update();

    ctx.resetTransform();
    ctx.clearRect(0, 0, ...SIZE.arr());
    ctx.translate(...player.pos.oppo().add(SIZE.div(2)).arr());

    enemyManager.render();
    player.render();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", main);

console.log(player);
console.log(mouseInput);



