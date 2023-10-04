function load(path) {
    let img = document.createElement("img");
    img.src = path;
    return img;
}

let images = {
    // for i in devil turtle ghost heart; do echo $i: "load(\"./images/$i.png\"),"; done;
    devil: load("./images/devil.png"),
    turtle: load("./images/turtle.png"),
    ghost: load("./images/ghost.png"),
    heart: load("./images/heart.png"),
}
export {images};