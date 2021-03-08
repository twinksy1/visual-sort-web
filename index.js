let canvas = document.getElementById("page-canvas");
let ctx = canvas.getContext("2d");
let minValue = 10;
let option = -1;
let isSorting = false;
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
let list = [];

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

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<list.length; i++) {
        list[i].draw();
    }
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

function swap(i,j) {
    let tmp = list[i].value;
    list[i].value = list[j].value;
    list[j].value = tmp;
}

function* selectionSort() {
    for(let i=0; i<list.length; i++) {
        checkOrder();
        for(let j=i; j<list.length; j++) {
            if(list[j].value < list[i].value) {
                swap(j, i);
                yield j;
            }
        }
    }
    isSorting = false;
}

function* bubbleSort() {
    let swapped = true;
    while(swapped) {
        checkOrder();
        swapped = false;
        for(let i=0; i<list.length-1; i++) {
            if(list[i].value > list[i+1].value) {
                swap(i, i+1);
                swapped = true;
                yield swapped;
            }
        }
    }
    isSorting = false;
}

function updateListAmount() {
    if(isSorting) return;
    canvas.width = document.body.clientWidth;
    let listAmount = document.getElementById("list-amount-slider").value;
    if(listAmount != list.length) {
        generateList(listAmount);
    }
    render();
}

function main() {
    switch(option) {
        case 0:
            // Bubble sort
            isSorting = true;
            sort = bubbleSort();
            function anim() {
                requestAnimationFrame(anim);
                render();
                sort.next(); // call next iteration of the bubbleSort function
            }
            anim();
            break;
        case 1:
            // Selection sort
            isSorting = true;
            sort = selectionSort();
            function anim() {
                requestAnimationFrame(anim);
                render();
                sort.next(); // call next iteration of the bubbleSort function
            }
            anim();
            break;
    }
}

setInterval(updateListAmount, 500);