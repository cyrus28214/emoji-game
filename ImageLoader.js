function load(path) {
    let img = document.createElement("img");
    img.src = path;
    return img;
}

let images = {
    /*
    for i in\
    devil \
    turtle \
    ghost\
    heart\
    tree\
    seedling\
    diamond\
    turtle_diamond\
    apple\
    red_diamond\
    turtle_die\
    apple\
    turtle_delicious\
    heart_heal\
    tick\
    robot\
    alien\
    red_devil\
    ; do echo $i: "load(\"./images/$i.png\"),"; done;
    */
    devil: load("./images/devil.png"),
    turtle: load("./images/turtle.png"),
    ghost: load("./images/ghost.png"),
    heart: load("./images/heart.png"),
    tree: load("./images/tree.png"),
    seedling: load("./images/seedling.png"),
    diamond: load("./images/diamond.png"),
    turtle_diamond: load("./images/turtle_diamond.png"),
    apple: load("./images/apple.png"),
    red_diamond: load("./images/red_diamond.png"),
    turtle_die: load("./images/turtle_die.png"),
    apple: load("./images/apple.png"),
    turtle_delicious: load("./images/turtle_delicious.png"),
    heart_heal: load("./images/heart_heal.png"),
    tick: load("./images/tick.png"),
    robot: load("./images/robot.png"),
    alien: load("./images/alien.png"),
    red_devil: load("./images/red_devil.png"),
}



export {images};