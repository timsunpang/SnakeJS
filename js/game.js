const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let s;

const BOARD_SIZE = 30;
const SCALE = 10;

canvas.width = BOARD_SIZE * SCALE;
canvas.height = BOARD_SIZE * SCALE;

// shim layer with setTimeout fallback 
window.requestAnimFrame = (function(){ 
  return  window.requestAnimationFrame       ||  
          window.webkitRequestAnimationFrame ||  
          window.mozRequestAnimationFrame    ||  
          window.oRequestAnimationFrame      ||  
          window.msRequestAnimationFrame     ||  
          function( callback ){ 
            window.setTimeout(callback, 1000 / 60); 
          }; 
})(); 

document.addEventListener('keydown', (e)=> {
	switch (event.keyCode) {
		case 37: //left
			s.changeDirection(-1,0);
			break;
		case 38: //Up
			s.changeDirection(0,-1);
			break;
		case 39: //Right
			s.changeDirection(1,0);
			break;
		case 40: //Down
			s.changeDirection(0,1);
			break;
	}
})


class Snake {
	constructor() {
		this.xSpeed,
		this.ySpeed,
		this.speedScale,
		this.xPos,
		this.yPos,
		this.appleXPos,
		this.appleYPos,
		this.snakeBody;
		this.initialize();
		window.requestAnimFrame(this.update.bind(this));
	};

	initialize() {
		this.xSpeed = 0;
		this.ySpeed = 1;
		this.speedScale = 1;
		this.xPos = 0;
		this.yPos = 0;
		this.spawnApple();
		this.snakeBody = [[this.xPos,this.yPos]];
	}

	update() {
		window.setTimeout(() => {
			ctx.clearRect(0,0,canvas.width, canvas.height);
			this.checkCollisions();
			this.eatFood();
			this.xPos += this.xSpeed * SCALE;
			this.yPos += this.ySpeed * SCALE;
			this.draw();
			window.requestAnimFrame(this.update.bind(this));
		}, 200 * (1/this.speedScale));
	};

	spawnApple() {
		this.appleXPos = Math.floor(Math.random() * Math.floor(BOARD_SIZE)) * SCALE;
		this.appleYPos = Math.floor(Math.random() * Math.floor(BOARD_SIZE)) * SCALE;
	}

	eatFood() {
		if (this.xPos == this.appleXPos && this.yPos == this.appleYPos) {
			this.snakeBody.push([null,null]);
			this.spawnApple();
			this.speedScale += .01;
		}
	}

	checkCollisions() {
		for (let i=1; i < this.snakeBody.length; i++) {
			if (this.xPos == this.snakeBody[i][0] && this.yPos == this.snakeBody[i][1]) {
				return this.initialize();
			}
		}

		if (this.xPos < 0 || this.xPos >= canvas.width || this.yPos < 0 || this.yPos >= canvas.height ) {
			return this.initialize();
		}
	}

	draw() {
		let prev, temp;
		// Draw Snake
		ctx.fillStyle = 'white';
		for (let i=0; i < this.snakeBody.length; i++) {
			temp = this.snakeBody[i];
			if (i == 0) {
				this.snakeBody[i] = [this.xPos, this.yPos];
			} else {
				this.snakeBody[i] = prev;
			}
			ctx.fillRect(this.snakeBody[i][0],this.snakeBody[i][1],1*SCALE,1*SCALE);
			prev = temp;
		}

		// Draw apple
		ctx.fillStyle = 'red';
		ctx.fillRect(this.appleXPos, this.appleYPos, 1*SCALE, 1*SCALE);
	}

	changeDirection(xSpeed, ySpeed) {
		if ((xSpeed != this.xSpeed && ySpeed != this.ySpeed) || this.snakeBody.length == 1) {
			this.xSpeed = xSpeed;
			this.ySpeed = ySpeed;
		}
	}
}

s = new Snake();