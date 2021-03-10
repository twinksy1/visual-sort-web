let canvas = document.getElementById("page-canvas");
let ctx = canvas.getContext("2d");
let minValue = 10;
let option = -1;
let isSorting = false;
let isShuffling = false;
let sort = 0;
let sleepTime = 0.75;
class Item {
    constructor(value, width, xpos) {
        this.value = value;
        this.width = width;
        this.xpos = xpos;
        this.color = "blue";
    }
    async draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xpos, canvas.height, this.width, -this.value);
        ctx.beginPath();
        ctx.rect(this.xpos, canvas.height, this.width, -this.value);
        ctx.stroke();
    }
}
var list = [];

function generateList(amount) {
    let width = canvas.width / amount;
    let x = 0;
    list = [];
    for(let i=0; i<amount; i++) {
        let value = Math.floor(Math.random() * (canvas.height-minValue)) + minValue;
        let item = new Item(value, width, x);
        list.push(item);
        x += width;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function checkOrder() {
    for(let i=0; i<list.length; i++) {
        if(i == list.length - 1) {
            if(list[i].value >= list[i-1].value) {
                list[i].color = "green";
            } else {
                list[i].color = "red";
            }
        } else if(i == 0) {
            if(list[i].value <= list[i+1].value) {
                list[i].color = "green";
            } else {
                list[i].color = "red";
            }
        } else {
            if(list[i].value >= list[i-1].value && list[i].value <= list[i+1].value) {
                list[i].color = "green";
            } else {
                list[i].color = "red";
            }
        }
    }
}

async function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(isSorting) await checkOrder();
    for(let i=0; i<list.length; i++) {
        if(list[i] != undefined) {
            list[i].draw();
        }
    }
    requestAnimationFrame(render);
}

function swap(i,j) {
    let tmp = list[i].value;
    list[i].value = list[j].value;
    list[j].value = tmp;
}

async function selectionSort() {
    for(let i=0; i<list.length; i++) {
        checkOrder();
        for(let j=i; j<list.length; j++) {
            if(list[j].value < list[i].value) {
                swap(j, i);
                await sleep(sleepTime);
            }
        }
    }
}

async function merge(l, m, r) {
    let left = list.slice(l, m);
    let right = list.slice(m, r);
    let res = [];
    let i = 0, j = 0;

    while(i < left.length && j < right.length) {
        if(left[i].value < right[j].value) {
            res.push(left[i].value);
            i++;
        } else {
            res.push(right[j].value);
            j++;
        }
    }
    
    while(i < left.length) {
        res.push(left[i].value);
        i++;
    }
    while(j < right.length) {
        res.push(right[j].value);
        j++;
    }
    i = 0;
    for(let k = l; k<r; k++) {
        list[k].value = res[i];
        i++;
        await sleep(sleepTime);
    }
}
async function mergeSort(l, r) {
    if(l+1 < r) {
        let m = Math.floor((r+l) / 2);
        await mergeSort(l, m);
        await mergeSort(m, r);
        await merge(l, m, r);
    }
}

async function heapify() {
    
}

async function heapSort() {

}

async function checkIdx(idx, b1, b2) {
    if(idx >= b1 && idx <= b2) return true;
    else if(idx <= b1 && idx >= b2) return true;
    else return false;
}

async function choosePivot(low, high) {
    // Return a suitable pivot for quick sort
    let mid = Math.floor((high + low) / 2);
    if(await checkIdx(list[mid].value, list[low].value, list[high].value)) {
        return mid;
    } else if(await checkIdx(list[low].value, list[mid].value, list[high].value)) {
        return low;
    } else {
        return high;
    }
}

async function partition(low, high) {
    let pivot = await choosePivot(low, high);
    let i = low == pivot ? low+1 : low;
    let j = high == pivot ? high-1 : high;
    let lowBound = false;
    let highBound = false;
    while(i < j) {
        if(list[i].value > list[pivot].value) {
            if(highBound) {
                await swap(i, j);
                await sleep(sleepTime);
            }
            else lowBound = true;
        } else {
            i++;
            lowBound = false;
        }
        if(list[j].value < list[pivot].value) {
            if(lowBound) {
                await swap(i, j);
                await sleep(sleepTime);
            }
            else highBound = true;
        } else {
            highBound = false;
            j--;
        }
    }
    swap(i, pivot);
    return pivot;
}

async function quickSort(low=0, high=list.length-1) {
    if(low+2 < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi);
        await quickSort(pi+1, high);
    }
    await insertionSort(low, high+1);
}

async function insertionSort(l=0, u=list.length) {
    let key = 0;
    for(let i=l+1; i<u; i++) {
        key = list[i].value; 
        j = i - 1; 
        while (j >= l && list[j].value > key) { 
            list[j+1].value = list[j].value;
            j = j - 1;
            await sleep(sleepTime);
        } 
        list[j+1].value = key; 
    }
}

async function bubbleSort(l=0, u=list.length) {
    let swapped = true;
    while(swapped) {
        swapped = false;
        for(let i=l; i<u-1; i++) {
            if(list[i].value > list[i+1].value) {
                await swap(i, i+1);
                swapped = true;
            }
            await sleep(sleepTime);
        }
    }
}

async function shuffle() {
    for(let i=0; i<list.length; i++) {
        list[i].color = "blue";
    }
    for(let i=0; i<list.length; i++) {
        let newIdx = Math.floor(Math.random() * list.length);
        while(newIdx == i) {
            newIdx = Math.floor(Math.random() * list.length);
        }
        swap(i, newIdx);
        await sleep(sleepTime);
    }
}

function updateListAmount() {
    if(isSorting || isShuffling) return;
    canvas.width = document.body.clientWidth;
    let listAmount = document.getElementById("list-amount-slider").value;
    if(listAmount != list.length) {
        generateList(listAmount);
    }
    render();
}

async function main() {
    switch(option) {
        case 0:
            isShuffling = true;
            await shuffle();
            isShuffling = false;
            break;
        case 1:
            // Bubble sort
            isSorting = true;
            await bubbleSort();
            break;
        case 2:
            // Selection sort
            isSorting = true;
            await selectionSort();
            break;
        case 3:
            // Selection sort
            isSorting = true;
            await insertionSort();
            break;
        case 4:
            // Heap sort
            isSorting = true;
            await heapSort();
            break;
        case 5:
            // Quick sort
            isSorting = true;
            await quickSort();
            break;
        case 6:
            // Merge sort
            isSorting = true;
            await mergeSort(0, list.length);
            break;
    }
    if(isSorting) await checkOrder();
    isSorting = false;
}

document.getElementById("shuffle").onclick = function() {
    option = 0;
    main();
}
requestAnimationFrame(render);
setInterval(updateListAmount, 500);