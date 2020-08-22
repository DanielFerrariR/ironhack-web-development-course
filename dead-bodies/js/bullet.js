/* Bullet information */
function Bullet(x, y, lastPosition, canvas, ctx, player) {
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 5;
  this.speed = 20;
  this.ctx = ctx;
  this.canvas = canvas;
  this.player = player;
  this.lastPosition = lastPosition;
}

/* Create and update the bullets on canvas */
Bullet.prototype.draw = function () {
  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(this.x, this.y, this.width, this.height);
};

/* Move the bullets each frame */
Bullet.prototype.move = function () {
  switch (this.lastPosition) {
    case 'up and right':
      this.x += this.speed * Math.cos((45 * Math.PI) / 180);
      this.y -= this.speed * Math.cos((45 * Math.PI) / 180);
      break;
    case 'up and left':
      this.x -= this.speed * Math.cos((45 * Math.PI) / 180);
      this.y -= this.speed * Math.cos((45 * Math.PI) / 180);
      break;
    case 'down and right':
      this.x += this.speed * Math.cos((45 * Math.PI) / 180);
      this.y += this.speed * Math.cos((45 * Math.PI) / 180);
      break;
    case 'down and left':
      this.x -= this.speed * Math.cos((45 * Math.PI) / 180);
      this.y += this.speed * Math.cos((45 * Math.PI) / 180);
      break;
    case 'left':
      this.x -= this.speed;
      break;
    case 'right':
      this.x += this.speed;
      break;
    case 'up':
      this.y -= this.speed;
      break;
    case 'down':
      this.y += this.speed;
      break;
    default:
      break;
  }
}