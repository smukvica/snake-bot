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

let fps = 8;
let frame = 0;

function setup() {
    frameRate(60);
    
    let myCanvas = createCanvas(width, height);
    myCanvas.parent('myContainer');

    let s1 = select("#num_row");
    let s2 = select("#num_col");
    number_row = s1.value();
    number_col = s2.value();
    offset_x = width/number_row * 0.5;
    offset_y = height/number_col * 0.5;

    snake = new Snake(round(number_col/4),round(number_row/2));
    food = new Food(snake);

    snake.calculate_new_route(food);
}
  
function draw() {
    background(200,200,200);

    // draw lines
    stroke(150);
    // vertical
    for (let x = width/number_row; x < width; x+=width/number_row){
        line(x, 0, x, height);
    }
    // horizontal
    for (let y = height/number_col; y < height; y+=height/number_col){
        line(0, y, width, y);
    }

    if(state == "game" && frame >= 60/fps){
        snake.update(mode);
        if(!snake.alive()){
            state = "over";
        }

        check_food();
        frame = 0;
    }
    food.draw();
    snake.draw("green");
    if(state == "over"){
        draw_over();
    }
    if(state == "win"){
        draw_win();
    }
    frame++;
    //console.log(frame);
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

function draw_win(){
    stroke("white");
    fill("white");
    rect(width/2 - 150, height/2 - 75, 300, 150);

    stroke("red");
    fill("red");
    textAlign(CENTER);
    textSize(50);
    text('You won!', width/2, height/2);
    stroke("black");
    fill("black");
    textSize(32);
    text('Score: '+snake.snake_length, width/2, height/2 + 50);
}

function check_food(){
    if(snake.x == food.x && snake.y == food.y){
        snake.eat_fruit();
        if(snake.snake_length < number_col*number_row){
            food = new Food(snake);
        }else{
            state = "win";
        }
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
}

function on_screen_coord(x,y){
    return [x * width/number_row + offset_x, y * height/number_col + offset_y]
}

function start(){
    state="game";
    mode="manual";
}

function setup_values(){
    let s1 = select("#num_row");
    let s2 = select("#num_col");
    number_row = s1.value();
    number_col = s2.value();
    snake = new Snake(round(number_col/4),round(number_row/2));
    food = new Food(snake);
    snake.calculate_new_route(food);
    offset_x = width/number_row * 0.5;
    offset_y = height/number_col * 0.5;
    fps = parseInt(select("#framerate").value());
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