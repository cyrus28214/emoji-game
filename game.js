let canvas;
let ctx;

let WIDTH = 1600;
let HEIGHT = 1200;

function loadImage(path) {
    let image = document.createElement("img");
    image.src = path;
    return image;
}

let images = {
    turtle: loadImage("./images/turtle.png"),
};

class Player {
    constructor() {
        this.x = WIDTH/2;
        this.y = HEIGHT/2;
        this.pivot_x = 0.5;
        this.pivot_y = 0.5;
        this.image = images.turtle;
        this.width = 200;
        this.height = 200;
    }

    update() {
        if (this.image.complete) {
            ctx.drawImage(
                this.image,
                this.x - this.width * this.pivot_x,
                this.y - this.height * this.pivot_y,
                this.width,
                this.height
            );
        }
    }
}

let player = new Player();

function resetDisplay() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let aspect_ratio = WIDTH / HEIGHT;
    if (w / h > aspect_ratio) {
        canvas.style.height = h + "px";
        canvas.style.width = h * aspect_ratio+ "px";
    }
    else {
        canvas.style.width = w+ "px";
        canvas.style.height = w / aspect_ratio+ "px";
    }
}

function main() {
    canvas = document.getElementById("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    resetDisplay();
    window.addEventListener("resize", resetDisplay);
    ctx = canvas.getContext("2d");
    gameLoop();
}

function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    player.update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", main);



