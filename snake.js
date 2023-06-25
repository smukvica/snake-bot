// Declaration
class Snake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.snake_size = width/number_row * 0.4;
        this.dir_x = 1;
        this.dir_y = 0;
        this.body = [[x-1, y], [x-2, y]];
        this.snake_length = this.body.length + 1;
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
            if(this.found_path == false){
                console.log("here");
                this.calculate_new_route(this.food);
            }
        }
    }

    draw(color){
        stroke(color);
        fill(color);
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

        let path_candidate = a_star(this, food.x, food.y);   // calculate path to food

        if(path_candidate == -1){    // path wasn't found
            console.log("not found");
            let tmp = a_star(this, this.body[this.body.length - 1][0], this.body[this.body.length - 1][1]);   // path to tail
            //console.log(tmp);
            this.path = tmp;
            this.food = food;   // food set for next path search
            this.found_path = false;    // set path not found to search each iteration for path
            return;
        } 

        if(path_candidate != -1){    // path was found
            console.log("found");

            // check if we can get to tail after we eat food
            let clone = new Snake(this.x, this.y);  
            clone.body = structuredClone(this.body);
            clone.path = structuredClone(path_candidate);
            clone.snake_length = this.snake_length;

            console.log("length:", clone.body.length, this.body.length);

            while(1){
                if(clone.x == food.x && clone.y == food.y){
                    break;
                }
                clone.update("auto");
            }
            clone.eat_fruit();

            let tail_path = a_star(clone, clone.body[clone.body.length - 1][0], clone.body[clone.body.length - 1][1]);
            clone.draw("blue");
            console.log("tail path: ", tail_path);
            if(tail_path == -1 || tail_path.length < 2){    // can't get to tail after
                console.log("found but can't tail");
                this.path = a_star(this, this.body[this.body.length - 1][0], this.body[this.body.length - 1][1]);   // go to tail now
                this.found_path = false;
                this.food = food;
                return;
            }
        }
        this.found_path = true;
        this.path = path_candidate;
    }
}

  