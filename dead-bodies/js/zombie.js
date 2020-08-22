/* Zombies information */
function Zombie(x, y, width, height, PLAYERS, canvas, ctx, image) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speedX = 1;
  this.speedY = 1;
  this.ctx = ctx;
  this.canvas = canvas;
  this.PLAYERS = PLAYERS;
  this.image = image;
  this.lastPosition = 'down';
}

/* Rotate image */
Zombie.prototype.drawRotatedImage = function (image, x, y, angle, width, height) {
  this.ctx.save();

  this.ctx.translate(x, y);

  this.ctx.rotate(angle * Math.PI / 180);

  this.ctx.drawImage(image, -(width / 2), -(height / 2), width, height);

  this.ctx.restore();
};

/* Check collision of the zombie with another object */
Zombie.prototype.checkCollision = function (object) {
  return (this.x <= object.x + object.width) && (this.x + this.width >= object.x) && (this.y <= object.y + object.height) && (this.y + this.height >= object.y);
};

/* Create and update the zombies on canvas */
Zombie.prototype.draw = function () {
  const image = new Image();

  image.onload = () => {
    console.log(this.lastPosition);
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

/* Move the zombies towards the player */
Zombie.prototype.move = function () {
  let closestPlayer;
  const size = (this.canvas.height > this.canvas.width) ? this.canvas.height : this.canvas.width;
  let distance = Math.sqrt((size ** 2) + (size ** 2));
  this.PLAYERS.forEach((player) => {
    if (distance > Math.sqrt(((this.x - player.x) ** 2) + ((this.y - player.y) ** 2))) {
      distance = Math.sqrt(((this.x - player.x) ** 2) + ((this.y - player.y) ** 2));
      closestPlayer = player;
    }
  });

  if (closestPlayer.x < this.x && closestPlayer.y < this.y) {
    this.x -= this.speedX * Math.cos((45 * Math.PI) / 180);
    this.y -= this.speedY * Math.cos((45 * Math.PI) / 180);
    this.lastPosition = 'up and left';
  } else if (closestPlayer.x < this.x && closestPlayer.y > this.y) {
    this.x -= this.speedX * Math.cos((45 * Math.PI) / 180);
    this.y += this.speedY * Math.cos((45 * Math.PI) / 180);
    this.lastPosition = 'down and left';
  } else if (closestPlayer.x > this.x && closestPlayer.y < this.y) {
    this.x += this.speedX * Math.cos((45 * Math.PI) / 180);
    this.y -= this.speedY * Math.cos((45 * Math.PI) / 180);
    this.lastPosition = 'up and right';
  } else if (closestPlayer.x > this.x && closestPlayer.y > this.y) {
    this.x += this.speedX * Math.cos((45 * Math.PI) / 180);
    this.y += this.speedY * Math.cos((45 * Math.PI) / 180);
    this.lastPosition = 'down and right';
  } else if (closestPlayer.x < this.x) {
    this.x -= this.speedX;
    this.lastPosition = 'left';
  } else if (closestPlayer.x > this.x) {
    this.x += this.speedX;
    this.lastPosition = 'right';
  } else if (closestPlayer.y < this.y) {
    this.y -= this.speedY;
    this.lastPosition = 'up';
  } else if (closestPlayer.y > this.y) {
    this.y += this.speedY;
    this.lastPosition = 'down';
  }
};
