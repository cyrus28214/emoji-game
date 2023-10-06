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
        r -= arr[i];
    }
    return arr.length - 1;
}

function doTimes(func, times) {
    for (let i = 0; i < times; ++i){
        func();
    }
}

function delIfTagged(arr) {
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i].del_tag) {
            arr.splice(i, 1);
            --i
        }
    }
    return arr;
}

export function getLiner(a, b) {
    return (x) => { return a * x + b; };
}

export function getLerp(x1, y1, x2, y2) {
    const a = (y1 - y2) / (x1 - x2);
    const b = (x1 * y2 - x2 * y1) / (x1 - x2);
    return (x) => {
        if (x <= x1) return y1;
        if (x >= x2) return y2;
        return a * x + b;
    }
}

export {lastElement, arrSum, randomWeight, doTimes, delIfTagged};