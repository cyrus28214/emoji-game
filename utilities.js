import {Vec} from "./Sprite.js"

function lastElement(arr) {
    return arr[arr.length-1];
}

function arrSum(arr) {
    let res = 0;
    for (let i = 0; i < arr.length; ++i) {
        res += arr[i];
    }
    return res;
}

function randomWeight(arr) {
    let total = arrSum(arr);
    let r = Math.random() * total;
    for (let i = 0; i < arr.length - 1; ++i) {
        if (r <= arr[i]) {
            return i;
        }
    }
    return arr.length - 1;
}

function doTimes(func, times) {
    for (let i = 0; i < times; ++i){
        func();
    }
}

export {lastElement, arrSum, randomWeight, doTimes};