import {Vec} from "./Sprite.js"

function lastElement(arr) {
    return arr[arr.length-1];
}

function thetaR(theta, r) {
    return new Vec(Math.cos(theta) * r, Math.sin(theta) * r);
}

export {lastElement, thetaR};