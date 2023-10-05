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

    update() {
        if (this.e1.pos.dist(this.e2.pos) <= this.e1.radius + this.e2.radius) {
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
}

const collisionSystem = new CollisionSystem();

export {CollisionEvent as ColEvent, ColCC, collisionSystem};