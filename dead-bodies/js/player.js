/* Player information */
function Player(id, up, right, down, left, fire, x, y, width, height, canvas, ctx, image) {
  this.id = id;
  this.up = up;
  this.right = right;
  this.down = down;
  this.left = left;
  this.fire = fire;
  this.BULLETS = [];
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.lastPosition = 'down';
  this.speedX = 5;
  this.speedY = 5;
  this.canvas = canvas;
  this.ctx = ctx;
  this.shootDelay = false;
  this.shootDelayTime = 333;
  this.image = image;
}

/* Rotate image */
Player.prototype.drawRotatedImage = function (image, x, y, angle, width, height) {
  this.ctx.save();

  this.ctx.translate(x, y);

  this.ctx.rotate(angle * Math.PI / 180);

  this.ctx.drawImage(image, -(width / 2), -(height / 2), width, height);

  this.ctx.restore();
};

/* Set a value to a player propriety */
Player.prototype.setValue = function (propriety, value) {
  this[propriety] = value;
};

/* Check collision of the player with another object */
Player.prototype.checkCollision = function (object) {
  return (this.x < object.x + object.width) && (this.x + this.width > object.x) && (this.y < object.y + object.height) && (this.y + this.height > object.y);
};

/* Create and update the player on canvas */
Player.prototype.draw = function () {
  const image = new Image();

  image.onload = () => {
    switch (this.lastPosition) {
      case 'up':
        this.drawRotatedImage(image, this.x, this.y, -90, this.width, this.height);
        break;
      case 'right':
        this.drawRotatedImage(image, this.x, this.y, 0, this.width, this.height);
        break;
      case 'down':
        this.drawRotatedImage(image, this.x, this.y, 90, this.width, this.height);
        break;
      case 'left':
        this.drawRotatedImage(image, this.x, this.y, -180, this.width, this.height);
        break;
      case 'up and left':
        this.drawRotatedImage(image, this.x, this.y, -135, this.width, this.height);
        break;
      case 'down and left':
        this.drawRotatedImage(image, this.x, this.y, 135, this.width, this.height);
        break;
      case 'up and right':
        this.drawRotatedImage(image, this.x, this.y, -45, this.width, this.height);
        break;
      case 'down and right':
        this.drawRotatedImage(image, this.x, this.y, 45, this.width, this.height);
        break;
      default:
        break;
    }
  };
  image.src = this.image;
};

/* Player movement based on key press */
Player.prototype.move = function (directionOne, directionTwo, PLAYERS) {
  switch (directionOne) {
    case 'left':
      if (directionTwo === 'up') {
        this.x -= this.speedX * Math.cos((45 * Math.PI) / 180);
        this.y -= this.speedY * Math.cos((45 * Math.PI) / 180);
        PLAYERS.forEach((player) => {
          if (this !== player && this.checkCollision(player)) {
            this.x += this.speedX * Math.cos((45 * Math.PI) / 180);
          }
          if (this !== player && this.checkCollision(player)) {
            this.y += this.speedY * Math.cos((45 * Math.PI) / 180);
          }
        });
        if (this.x < 0) {
          this.x = 0;
        }
        if (this.y < 0) {
          this.y = 0;
        }
      } else if (directionTwo === 'down') {
        this.x -= this.speedX * Math.cos((45 * Math.PI) / 180);
        this.y += this.speedY * Math.cos((45 * Math.PI) / 180);
        PLAYERS.forEach((player) => {
          if (this !== player && this.checkCollision(player)) {
            this.x += this.speedX * Math.cos((45 * Math.PI) / 180);
          }
          if (this !== player && this.checkCollision(player)) {
            this.y -= this.speedY * Math.cos((45 * Math.PI) / 180);
          }
        });
        if (this.x < 0) {
          this.x = 0;
        }
        if (this.y > this.canvas.height - this.height) {
          this.y = this.canvas.height - this.height;
        }
      } else {
        this.x -= this.speedX;
        PLAYERS.forEach((player) => {
          if (this !== player && this.checkCollision(player)) {
            this.x = player.x + player.width;
          }
        });
        if (this.x < 0) {
          this.x = 0;
        }
      }
      break;
    case 'right':
      if (directionTwo === 'up') {
        this.x += this.speedX * Math.cos((45 * Math.PI) / 180);
        this.y -= this.speedY * Math.cos((45 * Math.PI) / 180);
        PLAYERS.forEach((player) => {
          if (this !== player && this.checkCollision(player)) {
            this.x -= this.speedX * Math.cos((45 * Math.PI) / 180);
          }
          if (this !== player && this.checkCollision(player)) {
            this.y += this.speedY * Math.cos((45 * Math.PI) / 180);
          }
        });
        if (this.x > this.canvas.width - this.width) {
          this.x = this.canvas.width - this.width;
        }
        if (this.y < 0) {
          this.y = 0;
        }
      } else if (directionTwo === 'down') {
        this.x += this.speedX * Math.cos((45 * Math.PI) / 180);
        this.y += this.speedY * Math.cos((45 * Math.PI) / 180);
        PLAYERS.forEach((player) => {
          if (this !== player && this.checkCollision(player)) {
            this.x -= this.speedX * Math.cos((45 * Math.PI) / 180);
          }
          if (this !== player && this.checkCollision(player)) {
            this.y -= this.speedY * Math.cos((45 * Math.PI) / 180);
          }
        });
        if (this.x > this.canvas.width - this.width) {
          this.x = this.canvas.width - this.width;
        }
        if (this.y > this.canvas.height - this.height) {
          this.y = this.canvas.height - this.height;
        }
      } else {
        this.x += this.speedX;
        PLAYERS.forEach((player) => {
          if (this !== player && this.checkCollision(player)) {
            this.x = player.x - this.width;
          }
        });
        if (this.x > this.canvas.width - this.width) {
          this.x = this.canvas.width - this.width;
        }
      }
      break;
    case 'up':
      this.y -= this.speedY;
      PLAYERS.forEach((player) => {
        if (this !== player && this.checkCollision(player)) {
          this.y = player.y + player.height;
        }
      });
      if (this.y < 0) {
        this.y = 0;
      }
      break;
    case 'down':
      this.y += this.speedY;
      PLAYERS.forEach((player) => {
        if (this !== player && this.checkCollision(player)) {
          this.y = player.y - this.height;
        }
      });
      if (this.y > this.canvas.height - this.height) {
        this.y = this.canvas.height - this.height;
      }
      break;
    default:
      break;
  }
};
