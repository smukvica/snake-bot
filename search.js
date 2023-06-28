class GraphNode{
    constructor(x,y,prev_x, prev_y, goal_x, goal_y){
        this.x = x;
        this.y = y;
        this.prev_x = prev_x;
        this.prev_y = prev_y;
        this.g = number_col * number_row + 1;
        this.h = this.calculate_h(this.x, this.y, goal_x, goal_y);
        this.calculate_f();
    }

    calculate_h(x,y, goal_x, goal_y){
        return abs(x - goal_x) + abs(y - goal_y)
    }

    calculate_f(){
        this.f = this.g + this.h;
    }
}


function a_star(snake, start_x, start_y, goal_x, goal_y){

    let field = new Array(number_col * number_row);

    field.fill(0);

    let temp_length = snake.snake_length;
    field[get_index(snake.x, snake.y)] = temp_length;
    temp_length--;
    for(let i = 0; i < snake.body.length; i++){
        field[get_index(snake.body[i][0], snake.body[i][1])] = temp_length;
        temp_length--;
    }

    let open = [];
    let closed = [];

    temp = new GraphNode(start_x, start_y, null, null, goal_x, goal_y);
    temp.g = 0;

    open.push(temp);

    let current_node;
    let found = false;
    let counter = 0;
    while(open.length != 0){
        // get smallest f
        index = get_smallest_f(open);
        current_node = open[index];

        if(current_node.x == goal_x && current_node.y == goal_y){
            found = true;
            closed.push(current_node);
            break;
        }

        open.splice(index, 1);

        neighbours = get_neighbours(current_node.x, current_node.y, field, current_node.g + 1);

        for(let i = 0; i < neighbours.length; i++){
            tentative_g = current_node.g + 1;
            let check = neighour_is_in_set(neighbours[i][0], neighbours[i][1], open);
            let n;
            if(check == -1){
                n = new GraphNode(neighbours[i][0], neighbours[i][1], current_node.x, current_node.y, goal_x, goal_y);
                open.push(n);
            }else{
                n = open[check];
            }

            if(tentative_g < n.g){
                n.prev_x = current_node.x;
                n.prev_y = current_node.y;
                n.g = tentative_g;
                n.calculate_f();
            }
        }
        closed.push(current_node);

        counter++;
        if(counter > number_col * number_row * 10){
            return -1;
        }
    }

    if(found == true){
        let t = closed[neighour_is_in_set(goal_x, goal_y, closed)]
        path = [];
        while(t.prev_x != null && t.prev_y != null){
            path.push([t.x, t.y]);
            t = closed[neighour_is_in_set(t.prev_x, t.prev_y, closed)];
        }
        return path;
    }
    return -1;
}

function get_index(x,y){
    return y * number_col + x;
}

function get_coord(i){
    return [i % number_col, floor(i/number_col)];
}

function get_neighbours(x,y, field, steps){
    let neighbours = [];
    const search_hood = [[-1,0], [1,0], [0,-1], [0,1]]; // all four directions

    for(let i = 0; i < 4; i++){
        let x_n = x + search_hood[i][0];
        let y_n = y + search_hood[i][1];
        let c = get_index(x_n, y_n);
        if(x_n < 0 || x_n >= number_col){ // out of bounds x
            continue;
        }
        if(y_n < 0 || y_n >= number_row){ // out of bounds y
            continue;
        }
        if(field[c] > 1){ // hit itself
            continue;
        }
        neighbours.push([x_n,y_n]);
    }

    return neighbours;
}

function get_smallest_f(open){
    smallest = open[0].f;
    index = 0;
    for(i = 1; i < open.length; i++){
        if(open[i].f < smallest){
            smallest = open[i].f;
            index = i;
        }
    }   
    return index;
}

function neighour_is_in_set(x, y, set){
    for(i = 0; i < set.length; i++){
        if(x == set[i].x && y == set[i].y)
            return i;
    }
    return -1;
}

function long_path(snake){
    // TO DO
    let field = new Array(number_col * number_row);

    field.fill(0);

    field[get_index(snake.x, snake.y)] = 1;
    for(let i = 0; i < snake.body.length; i++){
        field[get_index(snake.body[i][0], snake.body[i][1])] = 1;
    }

    let neighbours = get_neighbours(snake.x, snake.y, field, 0);

    for(let i = 0; i < neighbours.length; i++){
        let n = neighbours[i];
        if(field[get_index(n[0], n[1])] == 1){ // neighbour is not free cell
            continue;
        }
        let tmp = a_star(snake, n[0], n[1], snake.body[snake.body.length - 1][0], snake.body[snake.body.length - 1][1]);
        if(tmp != -1){
            tmp.push(n);
            return tmp;
        }
    }
    return snake.path;
}