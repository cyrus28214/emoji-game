import {Vec} from "./Sprite.js";
import {EnemyManager} from "./Enemy.js";
import {ctx, SIZE, player, mouseInput} from "./global.js";
import { GoundDecManager } from "./GoundDec.js";
import { HpBar } from "./UI.js";
import { ColManager, ColCC } from "./Collision.js";
import { Effect, ItemManager } from "./Item.js";

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
let hpBar = new HpBar({entity: player});
let colManager = new ColManager();
let itemManager= new ItemManager();

function gameLoop() {
    mouseInput.update();
    goundDecManager.update();
    player.update();
    enemyManager.update();
    itemManager.update();

    let colList = [];
    for (const enemy of enemyManager.enemies) {
        colList.push(new ColCC({
            e1: player,
            e2: enemy,
            callback: () => {enemy.attack(player);}
        }));
    }
    for (const item of itemManager.entities) {
        colList.push(new ColCC({
            e1: player,
            e2: item,
            callback: () => {item.addEff(player);}
        }))
    }
    colManager.update(colList);

    hpBar.update();
    renderList.update(enemyManager.enemies.concat(goundDecManager.entities).concat(itemManager.entities).concat([player]));

    ctx.resetTransform();
    ctx.clearRect(0, 0, ...SIZE.arr());


    ctx.translate(...player.pos.oppo().add(SIZE.div(2)).arr());

    renderList.render();

    ctx.resetTransform();
    hpBar.render(ctx);
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", gameLoop);

console.log(player);
console.log(mouseInput);



