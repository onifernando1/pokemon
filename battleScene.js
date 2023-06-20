const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./assets/images/battleBackground.png";
const battleBackground = new Sprite({
  position: { x: 0, y: 0 },
  image: battleBackgroundImage,
});

const draggle = new Monster(monsters.Draggle);

const emby = new Monster(monsters.Emby);

console.log(monsters.Emby);

const renderedSprites = [draggle, emby];

console.log(emby.attacks);

emby.attacks.forEach((attack) => {
  const button = document.createElement("button");
  button.innerHTML = attack.name;
  document.querySelector("#attacksBox").append(button);
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animateBattle();

const queue = [];

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedAttack = attacks[e.target.innerHTML];
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });

    console.log(`RECIPIENT HEALTH: ${draggle.health}`);

    if (draggle.health <= 0) {
      queue.push(() => {
        draggle.faint();
      });
      return;
    }

    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites,
      });
    });
  });

  button.addEventListener("mouseenter", (e) => {
    const selectedAttack = attacks[e.target.innerHTML];
    document.querySelector("#attackType").innerHTML = selectedAttack.type;
    document.querySelector("#attackType").style.color = selectedAttack.color;
  });
});

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }
});
