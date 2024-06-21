class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "flame");
    // add physics so overlap (collision) works
    scene.physics.add.existing(this);
    this.speed = Phaser.Math.GetSpeed(600, 1);
  }

  fire(x, y) {
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);
  }

  update(time, delta) {
    this.x += this.speed * delta;
    //if the bullet's X position gets greater than 258 pixels,
    if (this.x > 256) {
      //deactivate, destroy, and log to the console that it's gone
      this.setActive(false);
      this.setVisible(false);
      console.log("bullet gone");
      this.destroy();
    }
  }
}
