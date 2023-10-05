import {Vec} from "./Sprite.js";
import {enemyManager} from "./Enemy.js";
import {ctx, SIZE, player, mouseInput} from "./global.js";
import { goundDecManager } from "./GoundDec.js";
import { HpBar, ScoreBoard } from "./UI.js";
import { collisionSystem, ColCC } from "./Collision.js";
import { itemManager } from "./Item.js";

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

let renderList = new RenderList();
let hpBar = new HpBar({entity: player});
let scoreBoard = new ScoreBoard();

let ii = false;

function gameLoop() {
    mouseInput.update();
    goundDecManager.update();
    player.update();
    enemyManager.update();
    itemManager.update();

    let colList = [];

    collisionSystem.update(colList);

    hpBar.update();
    if (!player.dead) scoreBoard.update();

    renderList.update(enemyManager.enemies.concat(goundDecManager.entities).concat(itemManager.entities).concat([player]));

    ctx.resetTransform();
    ctx.clearRect(0, 0, ...SIZE.arr());


    ctx.translate(...player.pos.oppo().add(SIZE.div(2)).arr());

    renderList.render();

    ctx.resetTransform();
    hpBar.render(ctx);
    scoreBoard.render(ctx);

    if(!ii){
        console.log(console.log(ctx));
        ii = true;
    }
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", gameLoop);

console.log(player);
console.log(mouseInput);




