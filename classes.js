class Sprite {
  constructor({
    position,
    velocity,
    image,
    background,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
  }) {
    // object prevents order mattering
    this.position = position;
    this.image = image;
    this.background = background;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max; // will only work when image loaded
      this.height = this.image.height;
    };

    this.animate = animate;
    this.sprites = sprites;
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

  attack({ attack, recipient }) {
    const tl = gsap.timeline();
    tl.to(this.position, { x: this.position.x - 20 })
      .to(this.position, {
        x: this.position.x + 40,
        duration: 0.1,
      })
      .to(this.position, {
        x: this.position.x,
      });
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
