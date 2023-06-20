class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = 48; // exported at 12 pixeled, then scaled by 4
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255,0,0,0"; // Colour boundaries red, last value = opacity
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
