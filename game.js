import {Vec} from "./Sprite.js";
import {randomWeight} from "./utilities.js";
import {Devil, Ghost} from "./Enemy.js";
import {ctx, SIZE, player, mouseInput} from "./global.js";
import { GoundDecManager } from "./GoundDec.js";

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.enemyTypes = [Devil, Ghost];
        this.weights = [6, 4];
        this.last_spawn_time = Date.now();
    }

    randomType() {
        return this.enemyTypes[randomWeight(this.weights)];
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
        let new_enemy = new type(pos);
        this.enemies.push(new_enemy);
        return new_enemy;
    }

    update() {
        if (Date.now() - this.last_spawn_time > 1000) {
            this.spawn();
            this.last_spawn_time = Date.now();
        }
        for (let i = 0; i < this.enemies.length; ++i) {
            const enemy = this.enemies[i];
            if (enemy.dead) {
                this.enemies.splice(i, 1);
            }
            else {
                enemy.update();
            }
        }
    }
}

class RenderList {
    constructor() {
        this.list = [];
    }

    update(entities) {
        this.list = entities;
        this.list.sort((a, b) => {
            return a.pos.y - b.pos.y;
        });
    }

    render() {
        for (const entity of this.list) {
            entity.render(ctx);
        }
    }
}

let enemyManager = new EnemyManager();
let goundDecManager = new GoundDecManager();
let renderList = new RenderList();


function gameLoop() {
    mouseInput.update();
    enemyManager.update();
    goundDecManager.update();
    player.update();
    renderList.update(enemyManager.enemies.concat(goundDecManager.entities).concat([player]));

    ctx.resetTransform();
    ctx.clearRect(0, 0, ...SIZE.arr());
    ctx.translate(...player.pos.oppo().add(SIZE.div(2)).arr());

    renderList.render();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", gameLoop);

console.log(player);
console.log(mouseInput);



