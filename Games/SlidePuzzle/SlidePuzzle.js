let source;

let tiles = [];
var cols = 4;
var rows = 4;
let w,h;
let board = [];

function preLoad (){
    source = loadImage("Games\SlidePuzzle\Puzzle.png");
}

function setup(){
    createCanvas (400,400);

    w = width / cols;
    h = heigh / rows; 

    for (let i = 0; i < cols; i++){

        for (let j = 0; j < rows; j++){
            let x = i * w;
            let y = j * h;
            let img = createImage (w,h);
            img.copy(source,x,y,w,h,0,0,w,h);
            let index = i + j * cols;
            board.push(index);
            let tile = new Tile (index,img);
            tiles.push(tile);
        } 

    }
}

function draw(){
    //image(source, 0, 0);

    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){

            let index = i + j * cols;
            let x = i * w; 
            let y = j * h;
            let tileIndex = board[index]
            let img = tiles[board[index]];
            image(img,x, y);
        }

    }

}

