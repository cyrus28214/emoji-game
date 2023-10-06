import { delIfTagged } from "./utilities.js";

class RenderSystem {
    constructor(paras) {
        this.entities = [];
    }

    add(entity) {
        this.entities.push(entity);
    }

    update() {
        this.entities = delIfTagged(this.entities);
    }

    render(ctx) {
        this.entities.sort((a, b) => {return a.bottom() - b.bottom()});
        this.entities.forEach((i) => {i.render(ctx)});
    }
}

export let renderSystem = new RenderSystem();