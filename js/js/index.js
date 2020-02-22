var rows = 10;
var columns = 10;
var width = 1300 / columns;
var height = width;

var canvas = document.getElementById("canvas");
var block;
var box;
var index = 1;

for(let x = 1; x <= rows; x++) {
    block = '<div id="block' + x + '" class="block"></div>';
    canvas.innerHTML += block;
    block = document.getElementById("block" + x);
    for(let y = 1; y <= columns; y++) {
        box = '<div id="box' + index + '" class="box" onclick="giveLife()" style="width:' + width + 'px; height:' + height + 'px;"></div>';
        block.innerHTML += box;
        document.getElementById("box" + index).addEventListener("click", function() {
            giveLife(index);
        }, false);
        index += 1;
    }
}

function giveLife(i) {
    console.log(i);
}