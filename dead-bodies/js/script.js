window.onload = () => {
  const canvas = document.getElementById('board');
  canvas.width = $(window).width();
  canvas.height = $(window).height();
  const ctx = canvas.getContext('2d');
  let playerOne = new Player(1, 'w', 'd', 's', 'a', ' ', canvas.width / 4 - 25, canvas.height / 2 - 25, 51, 43, canvas, ctx, './images/playerOne.png');
  let playerTwo = new Player(2, 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Delete', canvas.width - canvas.width / 4 - 25, canvas.height / 2 - 25, 52, 43, canvas, ctx, './images/playerTwo.png');
  let PLAYERS = [playerOne, playerTwo];
  let ZOMBIES = [];
  let frames = 0;
  let gameOverLoop = 0;
  let gameStarted = 0;

  /* Clean canvas */
  const cleanCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /* Stop the looper and print game over message */
  const rect = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 50,
    width: 200,
    heigth: 100
  };

  const gameOver = () => {
    let gameOverText = '';
    if (PLAYERS.length === 1) {
      gameOverText = 'Player ';
    } else {
      gameOverText = 'Players ';
    }
    PLAYERS.forEach((player) => {
      if (PLAYERS.length !== 1 && player.id !== PLAYERS[PLAYERS.length-1].id) {
        gameOverText += player.id + ' and ';
      } else {
        gameOverText += player.id + ' ';
      }
    });
    gameOverText += 'winned!';
    /* Show the players that winned the game */
    ctx.fillStyle = 'black';
    ctx.font = '48px serif'; /* Font does not reduce with the canvas */
    ctx.fillText(gameOverText, canvas.width / 2 - ctx.measureText(gameOverText).width / 2, canvas.height / 4); /* wrong height */
    /* Retry Button */
    ctx.fillStyle = 'black';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.heigth);
    ctx.font = '40px serif'; /* Font does not reduce with the canvas */
    ctx.fillStyle = 'white';
    const retryButton = 'Retry';
    ctx.fillText('Retry', rect.x + rect.width / 2 - ctx.measureText(retryButton).width / 2, rect.y + rect.heigth / 1.7); /* wrong height */
  };

  /* If the screen changes size, changes content position */
  // window.addEventListener('resize', () => {
  //   canvas.width = $(window).width();
  //   canvas.height = $(window).height();
  //   PLAYERS.forEach((player) => {
  //     if (player.x > canvas.width - player.width) {
  //       player.setValue('x', canvas.width - player.width);
  //     }
  //     if (player.y > canvas.height - player.height) {
  //       player.setValue('y', canvas.height - player.height);
  //     }
  //   });
  //   if (gameOverLoop === 1) {
  //     gameOver();
  //   }
  // });

  /* Draw players on canvas */
  const drawPlayers = () => {
    PLAYERS.forEach((player) => {
      player.draw();
    });
  };

  /* Draw and move the zombies on canvas */
  const drawZombies = () => {
    ZOMBIES.forEach((zombie) => {
      zombie.move();
      zombie.draw();
    });
  };

  const createZombies = () => {
    let x;
    let y;
    const width = 33; /* Fix size */
    const height = 43;
    const image = './images/zombie.png';
    if (frames % 60 === 0) {
      switch (Math.floor(Math.random() * 4 + 1)) {
        case 1:
          x = 0 - width;
          y = Math.floor(Math.random() * canvas.height);
          break;
        case 2:
          x = canvas.width;
          y = Math.floor(Math.random() * canvas.height);
          break;
        case 3:
          x = Math.floor(Math.random() * canvas.width);
          y = 0 - height;
          break;
        case 4:
          x = Math.floor(Math.random() * canvas.width);
          y = canvas.height;
          break;
        default:
          break;
      }
      ZOMBIES.push(new Zombie(x, y, width, height, PLAYERS, canvas, ctx, image));
    }
  };

  /* Create player bulllets */
  const createBullets = (player) => {
    if (player.BULLETS.length === 0 && !player.shootDelay) {
      switch (player.lastPosition) {
        case 'up and right':
          player.BULLETS.push(new Bullet(player.x + player.width, player.y, player.lastPosition, canvas, ctx, player));
          break;
        case 'up and left':
          player.BULLETS.push(new Bullet(player.x, player.y, player.lastPosition, canvas, ctx, player));
          break;
        case 'down and right':
          player.BULLETS.push(new Bullet(player.x + player.width, player.y + player.height, player.lastPosition, canvas, ctx, player));
          break;
        case 'down and left':
          player.BULLETS.push(new Bullet(player.x, player.y + player.height, player.lastPosition, canvas, ctx, player));
          break;
        case 'up':
          player.BULLETS.push(new Bullet(player.x + player.width / 2, player.y, player.lastPosition, canvas, ctx, player));
          break;
        case 'right':
          player.BULLETS.push(new Bullet(player.x + player.width, player.y + player.height / 2, player.lastPosition, canvas, ctx, player));
          break;
        case 'left':
          player.BULLETS.push(new Bullet(player.x, player.y + player.height / 2, player.lastPosition, canvas, ctx, player));
          break;
        case 'down':
          player.BULLETS.push(new Bullet(player.x + player.width / 2, player.y + player.height, player.lastPosition, canvas, ctx, player));
          break;
        default:
          break;
      }
      player.setValue('shootDelay', true);
      setTimeout(() => { player.setValue('shootDelay', false); }, player.shootDelayTime);
    }
  };

  /* Draw and move the bullets on Canvas */
  const drawBullets = () => {
    PLAYERS.forEach((player) => {
      player.BULLETS.forEach((bullet) => {
        if ((bullet.y < 0) || bullet.x < 0 || bullet.x > canvas.width || bullet.y > canvas.height) { /* wrong - needs to take bullet width and height in count */
          player.BULLETS.pop();
        } else {
          bullet.draw();
          bullet.move();
        }
      });
    });
  };

  /* Key pressed control */
  const down = {};
  $(document)
    .keydown(function (e) {
      down[e.key] = true;
    })
    .keyup(function (e) {
      down[e.key] = false;
    });

  const keysPressed = () => {
    PLAYERS.forEach((player) => {
      if (
        (down[player.up] && down[player.down])
        || (down[player.left] && down[player.right])
        || (down[player.up] && down[player.right] && down[player.down] && down[player.left])
      ) {
        /* Do nothing */
      } else if (down[player.up] && down[player.left]) {
        player.setValue('lastPosition', 'up and left');
        player.move('left', 'up', PLAYERS);
      } else if (down[player.down] && down[player.left]) {
        player.setValue('lastPosition', 'down and left');
        player.move('left', 'down', PLAYERS);
      } else if (down[player.up] && down[player.right]) {
        player.setValue('lastPosition', 'up and right');
        player.move('right', 'up', PLAYERS);
      } else if (down[player.down] && down[player.right]) {
        player.setValue('lastPosition', 'down and right');
        player.move('right', 'down', PLAYERS);
      } else if (down[player.left]) {
        player.setValue('lastPosition', 'left');
        player.move('left', 0, PLAYERS);
      } else if (down[player.up]) {
        player.setValue('lastPosition', 'up');
        player.move('up', 0, PLAYERS);
      } else if (down[player.right]) {
        player.setValue('lastPosition', 'right');
        player.move('right', 0, PLAYERS);
      } else if (down[player.down]) {
        player.setValue('lastPosition', 'down');
        player.move('down', 0, PLAYERS);
      }
      if (down[player.fire]) {
        createBullets(player);
      }
    });
  };

  const drawBackground = () => {
    const background = new Image();

    background.onload = function () {
      cleanCanvas();
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      if (gameStarted === 0) {
        /* Start Game Button */
        ctx.fillStyle = 'black';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.heigth);
        ctx.font = '40px serif'; /* Font does not reduce with the canvas */
        ctx.fillStyle = 'white';
        const startGameButton = 'Start Game';
        ctx.fillText('Start Game', rect.x + rect.width / 2 - ctx.measureText(startGameButton).width / 2, rect.y + rect.heigth / 1.7); /* wrong height */
        /* Game Title */
        const gameTitle = 'Dead Bodies';
        ctx.fillStyle = 'Green';
        ctx.font = '160px serif'; /* Font does not reduce with the canvas */
        ctx.fillText(gameTitle, canvas.width / 2 - ctx.measureText(gameTitle).width / 2, canvas.height / 4); /* wrong height */
      } else if (gameOverLoop === 1) {
        gameOver();
      } else {
        keysPressed();
        drawPlayers();
        drawBullets();
        createZombies();
        drawZombies();
      }
    };

    background.src = './images/background.jpg';
  };

  /* Check collision of the players with the zombies and the zombies with the bullets  */
  const collisionChecker = () => {
    ZOMBIES.forEach((zombie) => {
      PLAYERS.forEach((player) => {
        if (player.checkCollision(zombie)) {
          PLAYERS.splice(PLAYERS.indexOf(player), 1);
          gameOverLoop = 1;
          drawBackground();
        }
        player.BULLETS.forEach((bullet) => {
          if (zombie.checkCollision(bullet)) {
            ZOMBIES.splice(ZOMBIES.indexOf(zombie), 1);
            player.BULLETS.splice(player.BULLETS.indexOf(bullet), 1);
          }
        });
      });
    });
  };

  /* Loop to move everything on canvas */
  const render = () => {
    frames += 1;
    drawBackground();
    collisionChecker();
    if (gameOverLoop === 0) {
      window.requestAnimationFrame(render);
    }
  };

  /* Mouse click */
  const getMousePos = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const isInside = (pos, rect) => {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.heigth && pos.y > rect.y;
  };

  canvas.addEventListener('click', (e) => {
    const mousePos = getMousePos(canvas, e);
    if (isInside(mousePos, rect) && gameStarted === 0) {
      gameStarted = 1;
      cleanCanvas();
      render();
    }
    if (isInside(mousePos, rect) && gameOverLoop === 1) {
      playerOne = new Player(1, 'w', 'd', 's', 'a', ' ', canvas.width / 4 - 25, canvas.height / 2 - 25, 51, 43, canvas, ctx, './images/playerOne.png');
      playerTwo = new Player(2, 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Delete', canvas.width - canvas.width / 4 - 25, canvas.height / 2 - 25, 52, 43, canvas, ctx, './images/playerTwo.png');
      PLAYERS = [playerOne, playerTwo];
      ZOMBIES = [];
      frames = 0;
      gameOverLoop = 0;
      cleanCanvas();
      render();
    }
  }, false);

  drawBackground();
};
