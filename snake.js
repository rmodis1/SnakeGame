// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the size of each box in the grid
const box = 20;
const canvasSize = 400;

// Initialize the snake with one segment
let snake = [{ x: 9 * box, y: 10 * box }];

// Set the initial direction of the snake
let direction = 'RIGHT';

// Generate the initial food position randomly
let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
};

// Initialize the obstacles
let obstacles = [
    { x: 3 * box, y: 3 * box },
    { x: 7 * box, y: 7 * box },
    { x: 13 * box, y: 13 * box }
];

// Initialize the score
let score = 0;

// Listen for keydown events to change the snake's direction
document.addEventListener('keydown', changeDirection);

// Function to change the direction of the snake based on key pressed
function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

// Function to check for collisions
function collision(newHead, array) {
    for (let i = 0; i < array.length; i++) {
        if (newHead.x === array[i].x && newHead.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white'; // Head is green, body is white
        ctx.fillRect(snake[i].x, snake[i].y, box, box); // Draw the snake segment
        ctx.strokeStyle = 'red'; // Outline color
        ctx.strokeRect(snake[i].x, snake[i].y, box, box); // Draw the outline
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Draw the obstacles
    ctx.fillStyle = 'blue';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
    }

    // Get the current head position of the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Update the head position based on the current direction
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Check if the snake has eaten the food
    if (snakeX === food.x && snakeY === food.y) {
        // Generate new food position
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
        score++; // Increase the score
        document.getElementById('score').innerText = 'Score: ' + score; // Update the score display
    } else {
        // Remove the last segment of the snake
        snake.pop();
    }

    // Create new head for the snake
    let newHead = { x: snakeX, y: snakeY };

    // Wrap the snake's position if it goes through the wall
    if (snakeX < 0) newHead.x = canvas.width - box;
    if (snakeY < 0) newHead.y = canvas.height - box;
    if (snakeX >= canvas.width) newHead.x = 0;
    if (snakeY >= canvas.height) newHead.y = 0;

    // Check for collisions with itself or obstacles
    if (collision(newHead, snake) || collision(newHead, obstacles)) {
        clearInterval(game); // Stop the game if collision occurs
    }

    // Add the new head to the snake
    snake.unshift(newHead);
}

// Set the game loop to run every 100 milliseconds
let game = setInterval(draw, 100);