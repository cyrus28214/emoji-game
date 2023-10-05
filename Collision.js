class CollisionEvent {
    constructor(paras) {
        Object.assign(this, {
            del_tag: false
        }, paras);
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

    del() {
        this.del_tag = true;
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
        for (let i = 0; i < this.cols.length; ++i) {
            const event = this.cols[i];
            if (event.del_tag) {
                this.cols.splice(i, 1);
            }
            else {
                event.update();
            }
        }  
    }
}

const collisionSystem = new CollisionSystem();

export {CollisionEvent as ColEvent, ColCC, collisionSystem};