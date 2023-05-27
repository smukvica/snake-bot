// Declaration
class Snake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.snake_size = width/number_row * 0.4;
        this.dir_x = 1;
        this.dir_y = 0;
        this.body = [[x-1, y], [x-2, y]];
        this.snake_length = this.body.length;
        this.path = [];
        this.command_queue = [];
    }

    update(type){
        for(let i = this.body.length-1; i > 0; i--){
            this.body[i] = this.body[i-1];
        }
        this.body[0] = [this.x, this.y]
        if(type == "manual"){
            let command = this.command_queue.shift();
            if(command != null){
                this.dir_x = command[0];
                this.dir_y = command[1];
            }
            this.x += this.dir_x;
            this.y += this.dir_y;
        }else if(type == "auto"){
            let next = this.path.pop();
            this.x = next[0];
            this.y = next[1];
        }
    }

    draw(){
        stroke("green");
        fill("green");
        strokeWeight(this.snake_size);
        for(let i = 0; i < this.body.length - 1; i++){
            let coord1 = on_screen_coord(this.body[i][0], this.body[i][1]);
            let coord2 = on_screen_coord(this.body[i+1][0], this.body[i+1][1]);
            line(coord1[0], coord1[1], coord2[0], coord2[1]);
        }

        let coord1 = on_screen_coord(this.x, this.y);
        let coord2 = on_screen_coord(this.body[0][0], this.body[0][1]);
        line(coord1[0], coord1[1], coord2[0], coord2[1]);

        let coord = on_screen_coord(this.x, this.y);
        ellipse(coord[0], coord[1], this.snake_size, this.snake_size);

        strokeWeight(1);
    }

    eat_fruit(){
        this.body.push(this.body[this.body.length-1]);
        this.snake_length++;
    }

    set_dir(x,y){
        if(this.command_queue.length == 0){ // command queue is empty check current dir
            let cmp_x = this.dir_x
            let cmp_y = this.dir_y
            if((x != cmp_x || x != -cmp_x) && (y != cmp_y || y != -cmp_y))  // if not the same axis as current dir
                this.command_queue.push([x,y]);
        }else{  // command queue is not empty check last command
            let cmp_x = this.command_queue[this.command_queue.length-1][0]
            let cmp_y = this.command_queue[this.command_queue.length-1][1]
            if((x != cmp_x || x != -cmp_x) && (y != cmp_y || y != -cmp_y))  // if not the same axis as command
                this.command_queue.push([x,y]);
        }
    }

    alive(){
        if(this.x < 0 || this.x >= number_col || this.y < 0 || this.y >= number_row)  // out of bounds | hit a wall
            return false;
        for(let i = 0; i < this.body.length; i++){
            if(this.x == this.body[i][0] && this.y == this.body[i][1]) // hit itself
                return false;
        }
        return true;
    }

    calculate_new_route(food){
        let temp = [this.x,this.y];
        let snake_route = [];
    
        let field = new Array(number_row);
        
        for(let i = 0; i < number_row; i++){
            field[i] = new Array(number_col).fill(0);
        }
    
        field[this.x][this.y] = this.snake_length;
        let current = this.snake_length - 1;
        for(let i = 0; i < this.body.length; i++){
            field[this.body[i][1]][this.body[i][0]] = current;
            current--;
        }
    
        field[food.x][food.y] = -1;
    
        while(temp[0] != food.x){
            if(food.x > temp[0])
                temp[0]++;
            else
                temp[0]--;
            snake_route.push([temp[0], temp[1]]);
        }
        while(temp[1] != food.y){
            if(food.y > temp[1])
                temp[1]++;
            else
                temp[1]--;
            snake_route.push([temp[0], temp[1]]);
        }
    
        this.path = snake_route.reverse();
    }
}

  