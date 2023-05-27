let number_col = 15;
let number_row = 15;

let width = 800;
let height = 800;

let offset_x = width/number_row * 0.5;
let offset_y = height/number_col * 0.5;

let snake;
let food;

let state = "wait";
let mode = "manual";

function setup() {
    frameRate(8);
    let myCanvas = createCanvas(width, height);
    myCanvas.parent('myContainer');

    let button1 = createButton('start');
    //button1.position(windowWidth * 0.5 - button1.width * 0.5, windowHeight * 0.8);
    button1.parent('buttons');
    button1.mousePressed(start);

    let button2 = createButton('reset');
    //button2.position(windowWidth * 0.5 - button2.width * 0.5, windowHeight * 0.8 + 30);
    button2.parent('buttons');
    button2.mousePressed(restart);

    let button3 = createButton('auto');
    //button3.position(windowWidth * 0.5 - button3.width * 0.5, windowHeight * 0.8 + 60);
    button3.parent('buttons');
    button3.mousePressed(bot);

    snake = new Snake(round(number_col/4),round(number_row/2));
    food = new Food(snake);

    snake.calculate_new_route(food);
}
  
function draw() {
    background(245,245,245);

    // draw lines
    stroke(200);
    // vertical
    for (let x = width/number_row; x < width; x+=width/number_row){
        line(x, 0, x, height);
    }
    // horizontal
    for (let y = height/number_col; y < height; y+=height/number_col){
        line(0, y, width, y);
    }

    if(state == "game"){
        snake.update(mode);
        if(!snake.alive()){
            state = "over";
        }

        check_food();
    }
    food.draw();
    snake.draw();
    if(state == "over"){
        draw_over();
    }
}

function draw_over(){
    stroke("white");
    fill("white");
    rect(width/2 - 150, height/2 - 75, 300, 150);

    stroke("red");
    fill("red");
    textAlign(CENTER);
    textSize(50);
    text('Game Over', width/2, height/2);
    stroke("black");
    fill("black");
    textSize(32);
    text('Score: '+snake.snake_length, width/2, height/2 + 50);
}

function check_food(){
    if(snake.x == food.x && snake.y == food.y){
        food = new Food(snake);
        snake.eat_fruit();
        if(mode == "auto")
            snake.calculate_new_route(food);
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        snake.set_dir(0, -1);
    } else if (keyCode === DOWN_ARROW) {
        snake.set_dir(0, 1);
    } else if (keyCode === LEFT_ARROW) {
        snake.set_dir(-1, 0);
    } else if (keyCode === RIGHT_ARROW) {
        snake.set_dir(1, 0);
    }
    if (state == "wait")
        state = "game";
}

function on_screen_coord(x,y){
    return [x * width/number_row + offset_x, y * height/number_col + offset_y]
}

function start(){
    state="game";
    mode="manual";
}

function restart(){
    snake = new Snake(round(number_col/4),round(number_row/2));
    food = new Food(snake)
    snake.calculate_new_route(food);
    state = "wait";
}

function bot(){
    state = "game";
    mode = "auto";
}

function print_field(field){
    for(let i = 0; i < number_row; i++){
        console.log(...field[i]);
    }
}