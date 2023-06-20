class Sprite {
  constructor({
    position,
    velocity,
    image,
    background,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    rotation = 0,
  }) {
    // object prevents order mattering
    this.position = position;
    this.image = new Image();
    this.background = background;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.opacity = 1;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max; // will only work when image loaded
      this.height = this.image.height;
    };

    this.image.src = image.src;

    this.animate = animate;
    this.sprites = sprites;
    this.rotation = rotation;
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
}
