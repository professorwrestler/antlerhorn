class Enemy extends Phaser.GameObjects.Sprite
{
    constructor (scene)
    {
        super(scene, 0, 0, 'enemy1');
        // add physics so overlap (collision) works
        scene.physics.add.existing(this);
        
        }


    update ()
    {
        
        
        //keep it moving slowly to the left 
        this.x -= .8;
        //if its X position gets to negative 20 (if it goes twenty pixels to the left of the view window)
        if (this.x < -20)
        {
            //deactivate, destroy, and log to the console that it's been destroyed
            this.setActive(false);
            this.setVisible(false);
            console.log("destroyed");
            this.destroy();
        }
    }
}