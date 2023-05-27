class Food {
    constructor(s, food_size){
        let choices = [];
        for (let i = 0; i < number_row; i++){
            for (let j = 0; j < number_col; j++){
                choices.push([i,j]);
            }
        }
        choices.splice(s.x*number_col+s.y, 1);
        for (let i = 0; i < s.body.length; i++){
            for (let j = 0; j < choices.length; j++){
                if (s.body[i][0] == choices[j][0] && s.body[i][1] == choices[j][1]){
                    choices.splice(j, 1);
                    break;
                }
            }
        }
        //console.log(choices);
        let r = round(random(choices.length)-1);
        this.x = choices[r][0];
        this.y = choices[r][1];
        this.food_size = width/number_row * 0.45;
    }

    draw(){
        stroke("red");
        fill("red");
        let coord = on_screen_coord(this.x, this.y);
        ellipse(coord[0], coord[1], this.food_size, this.food_size);
    }
}