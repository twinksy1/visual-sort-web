let canvas = document.getElementById("page-canvas");
let ctx = canvas.getContext("2d");
let minValue = 10;
let option = -1;
let isSorting = false;
let isShuffling = false;
let sort = 0;
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

function checkOrder() {
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
                await sleep(1);
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
        await sleep(1);
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

async function heapSort() {

}

async function quickSort() {

}

async function insertionSort() {
    let key = 0;
    for(let i=1; i<list.length; i++) {
        checkOrder();
        key = list[i].value; 
        j = i - 1; 
        while (j >= 0 && list[j].value > key) { 
            list[j+1].value = list[j].value;
            j = j - 1;
            await sleep(1);
        } 
        list[j+1].value = key; 
    }
    checkOrder();
}

async function bubbleSort() {
    let swapped = true;
    while(swapped) {
        swapped = false;
        for(let i=0; i<list.length-1; i++) {
            if(list[i].value > list[i+1].value) {
                swap(i, i+1);
                swapped = true;
            }
            await sleep(1);
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
        await sleep(1);
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
    isSorting = false;
}

document.getElementById("shuffle").onclick = function() {
    option = 0;
    main();
}
requestAnimationFrame(render);
setInterval(updateListAmount, 500);