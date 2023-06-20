class Sprite {
  constructor({
    position,
    velocity,
    image,
    background,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    isEnemy = false,
    rotation = 0,
    name,
  }) {
    // object prevents order mattering
    this.position = position;
    this.image = image;
    this.background = background;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.opacity = 1;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max; // will only work when image loaded
      this.height = this.image.height;
    };

    this.animate = animate;
    this.sprites = sprites;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.rotation = rotation;
    this.name = name;
  }

  draw() {
    if (this.background == true) {
      const scaledWidth = this.image.width * 4; // Calculate the scaled width
      const scaledHeight = this.image.height * 4; // Calculate the scaled height
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        scaledWidth,
        scaledHeight
      ); // Start at house
    } else {
      c.save(); // if global property used, only affects this not rest of canvas

      //   ); // move rotation axis to center of sprite
      c.translate(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2
      );
      c.rotate(this.rotation);
      c.translate(
        -this.position.x - this.width / 2,
        -this.position.y - this.height / 2
      );
      c.globalAlpha = this.opacity;
      c.drawImage(
        this.image,
        this.frames.val * this.width, // x start crop at next player sprite image
        0, // y start crop
        this.image.width / this.frames.max, //crop one section of image (x axis),
        this.image.height, // crop one section of image (y axis)
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max, //size to render
        this.image.height // size to render
      ); // Declare player image after map loads as map larger, place in center

      c.restore(); // if global property used, only affects this not rest of canvas

      if (!this.animate) return;

      if (this.frames.max > 1) {
        // only animate when player moves

        this.frames.elapsed++;
      }

      if (this.frames.elapsed % this.frames.hold === 0) {
        if (this.frames.val < this.frames.max - 1) {
          this.frames.val++;
        }
        // as player is 4 images side by side, loop through and then restart
        else {
          this.frames.val = 0;
        }
      }
    }
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML;

    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthbar";

    let rotation = 1;

    if (this.isEnemy) rotation = -2.4;

    this.health -= attack.damage;

    switch (attack.name) {
      case "Fireball":
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
        console.log(renderedSprites);

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            gsap.to(healthBar, {
              width: this.health - attack.damage + "%",
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
              gsap.to(healthBar, {
                width: this.health - attack.damage + "%",
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

class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = 48; // exported at 12 pixeled, then scaled by 4
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255,0,0,0.3";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
