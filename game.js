import {Vec} from "./Sprite.js";
import {enemyManager} from "./Enemy.js";
import {ctx, SIZE, player, mouseInput, totalTick, increTick} from "./global.js";
import { goundDecManager, tree_list } from "./GoundDec.js";
import { collisionSystem, ColCC } from "./Collision.js";
import { itemManager } from "./Item.js";
import { renderSystem } from "./RenderSystem.js";
import { HpBar, RestartButton, ScoreBoard } from "./UI.js";

let hpBar = new HpBar({entity: player});
let scoreBoard = new ScoreBoard();
let restartButton = new RestartButton();

let ii = false;

function gameLoop() {
    goundDecManager.update();
    if (!player.dead) player.update();
    enemyManager.update();
    if (!player.dead) itemManager.update();
    collisionSystem.update();
    collisionSystem.repel(tree_list, enemyManager.enemies.concat([player]));

    hpBar.update();
    if (player.dead) restartButton.update();
    if (!player.dead) scoreBoard.update();

    renderSystem.update();
    
    ctx.resetTransform();
    ctx.clearRect(0, 0, ...SIZE.arr());


    ctx.translate(...player.pos.oppo().add(SIZE.div(2)).arr());

    renderSystem.render(ctx);

    ctx.resetTransform();
    hpBar.render(ctx);
    scoreBoard.render(ctx);
    if (player.dead) restartButton.render(ctx);
    if(!ii){
        console.log(console.log(ctx));
        ii = true;
    }
    
    increTick();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", gameLoop);

console.log(player);
console.log(mouseInput);
console.log(restartButton);



