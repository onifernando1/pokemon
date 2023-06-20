class Monster extends Sprite {
  constructor({
    isEnemy = false,
    name,
    position,
    velocity,
    image,
    background,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    rotation = 0,
    attacks = [],
  }) {
    super({
      position,
      velocity,
      image,
      background,
      frames,
      sprites,
      animate,
      rotation,
      attacks,
    });
    this.name = name;
    this.isEnemy = isEnemy;
    this.health = 100;
    this.attacks = attacks;
  }

  faint() {
    document.querySelector("#dialogueBox").innerHTML = this.name + " fainted!";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.battle.stop();
  }
  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      this.name + " used " + attack.name;

    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthbar";

    let rotation = 1;

    if (this.isEnemy) rotation = -2.4;

    recipient.health -= attack.damage;

    switch (attack.name) {
      case "Fireball":
        audio.initFireball.play();
        const fireballImage = new Image();
        fireballImage.src = "./assets/images/fireball.png";
        const fireball = new Sprite({
          position: { x: this.position.x, y: this.position.y },
          image: fireballImage,
          frames: { max: 4, hold: 10 },
          animate: true,
          rotation,
        });

        renderedSprites.splice(1, 0, fireball);

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            audio.fireballHit.play();
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });

            renderedSprites.splice(1, 1);
            console.log(renderedSprites);
          },
        });
        break;
      case "Tackle":
        const tl = gsap.timeline();
        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, { x: this.position.x - movementDistance })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              audio.tackleHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });

              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
    }
  }
}
