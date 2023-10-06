import { Devil, RedDevil } from "./Enemy.js";
import { Vec } from "./Sprite.js";

class CollisionEvent {
    constructor(paras) {
        Object.assign(this, {
            del_tag: false
        }, paras);
    }

    del() {
        this.del_tag = true;
    }
}

class ColCC extends CollisionEvent{
    constructor(paras) {
        super(paras);
    }

    test() {
        return this.e1.pos.dist(this.e2.pos) <= this.e1.radius + this.e2.radius;
    }

    update() {
        if (this.test()) {
            this.callback(this);
        }
    }
}

class CollisionSystem {
    constructor(paras) {
        Object.assign(this, {
            cols: [],
        }, paras);
    }

    add(type, e1, e2, callback) {
        const col_event = new type({e1: e1, e2: e2, callback: callback}); 
        this.cols.push(col_event);
        return col_event;
    }

    update() {
        this.cols = this.cols.filter(i => {return !(i.del_tag || i.e1.del_tag || i.e2.del_tag);});
        this.cols.forEach(i => {i.update();});
    }

    repel(trees, es) {
        for (const e of es) {
            for (const tree of trees) {
                if (tree.pos.dist(e.pos) < tree.radius + e.radius) {
                    e.pos = tree.pos.add(Vec.pointsR(tree.pos, e.pos, tree.radius + e.radius));
                }
            }
        }
    }

    devil_kill(enemies) {
        let devils = enemies.filter(i => { return i instanceof Devil || i instanceof RedDevil; });
        let others = enemies.filter(i => { return !(i instanceof Devil || i instanceof RedDevil); });
        if (others.length === 0) return;
        for (const i of devils) {
            let d = others.map(j => { return i.pos.dist(j.pos); });
            let j = 0;
            for (let k = 1; k < others.length; ++k)
                if (d[k] < d[j]) j = k;
            for (let k = 0; k < others.length; ++k)
                if (d[k] < i.radius + others[k].radius){
                    others[k].hp -= i.dmg;
                }
            if (d[j] < 400) i.move(Vec.pointsR(i.pos, others[j].pos, i.speed * 1.5));
        }
    }
}

const collisionSystem = new CollisionSystem();

export {CollisionEvent as ColEvent, ColCC, collisionSystem};