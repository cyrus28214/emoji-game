function load(path) {
    let img = document.createElement("img");
    img.src = path;
    return img;
}

let images = {
    // for i in devil turtle ghost heart tree seedling diamond turtle_diamond red_diamond; do echo $i: "load(\"./images/$i.png\"),"; done;
    devil: load("./images/devil.png"),
    turtle: load("./images/turtle.png"),
    ghost: load("./images/ghost.png"),
    heart: load("./images/heart.png"),
    tree: load("./images/tree.png"),
    seedling: load("./images/seedling.png"),
    diamond: load("./images/diamond.png"),
    turtle_diamond: load("./images/turtle_diamond.png"),
    red_diamond: load("./images/red_diamond.png"),
}



export {images};