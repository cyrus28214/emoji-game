class ColEvent {
    constructor(paras) {
        Object.assign(this, paras);
    }
}

class ColCC extends ColEvent{
    constructor(paras) {
        super(paras);
    }

    update() {
        if (this.e1.pos.dist(this.e2.pos) <= this.e1.radius + this.e2.radius) {
            this.callback(this);
        }
    }
}

class ColManager {
    constructor(paras) {
        Object.assign(this, {
            events: [],
        }, paras);
    }

    update(events) {
        this.events = events;
        for (const event of this.events) {
            event.update();
        }  
    }
}

export {ColEvent, ColCC, ColManager};