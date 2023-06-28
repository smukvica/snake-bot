# Snake-bot

A simple snake game with an option to let a bot play.

The game can be accessed [Here](https://smukvica.github.io/snake-bot/).

----

## Instructions

To play the game simply open up the webpage.

----

On the right you have some settings to change the game.

The number of rows/columns are pretty straightforward and change the number of rows and columns the snake can traverse.

The updates per second sets up the number of times the game step happends in a second. The bigger the number the faster the snake.

----

The button **Start** starts the game in manual play, the button **Reset** resets the board to initial state, and the button **Run bot** starts the game in *auto-play* where the bot plays the game automatically.

----

## How it works

The auto bot simply uses A* algorithm to find the closest path to the food. In the event that the food can't be reached, the bot decides to follow it's tail. This is achieved using A* but with an additional condition of using a neighbouring empty cell as a starting point in order to fill the empty cells to not leave empty spots on the map for easier play.

----

### Issues

As of now the bot sometimes doesn't always win the game and loops itself in catching it's own tail. Sometimes it also decides to leave this plane of existence and crashes into itself resulting in a premature end of game.