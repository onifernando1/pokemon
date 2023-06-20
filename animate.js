function animate() {
  const animationId = window.requestAnimationFrame(animate); // arg = function to be called recursively
  c.imageSmoothingEnabled = false; // Disable image smoothing
  background.draw();

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  player.draw();

  foreground.draw(); //rendered last so we can travel behind objects

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  if (keys.a.pressed || keys.w.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      //loop through every battlezone
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 && //divide by two to increase chance of battle and prevent trigger if travelling along edges
        Math.random() < 0.01
      ) {
        console.log("BATTLE");

        // deactivate old animation loop
        window.cancelAnimationFrame(animationId);

        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();

        battle.initiated = true;

        triggerBattleAnimation();

        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }
  }

  if (keys.w.pressed && lastKey == "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y + 3 }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey == "a") {
    player.animate = true;
    player.image = player.sprites.left;

    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x + 3, y: boundary.position.y }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey == "s") {
    player.animate = true;
    player.image = player.sprites.down;

    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y - 3 }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey == "d") {
    player.animate = true;
    player.image = player.sprites.right;

    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x - 3, y: boundary.position.y }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x -= 3;
      });
  }
}
