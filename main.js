import './style.css'
import { resources } from './src/Resource';
import { Sprite } from './src/Sprite';
import { Vector2 } from './src/Vector2';
import { GameLoop } from './src/Gameloop';
import { Input } from './src/Input';
import { gridCells } from './src/helpers.js/grid';
import { GameObject } from './src/GameObject';
import { Hero } from './src/objects/Hero/Hero';
import { events } from './src/Events';
import { Camera } from './src/Camera';

// Grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");


// Establish the root scene
const mainScene = new GameObject({
    position: new Vector2(0, 0)
})


// Build up the scene: add sky
const skySprite = new Sprite({
        resource: resources.images.sky,
        frameSize: new Vector2(320, 180)
})


// Add ground
const groundSprite = new Sprite({
        resource: resources.images.ground,
        frameSize: new Vector2(320, 180)
})
mainScene.addChild(groundSprite);


// Add player
const hero = new Hero(gridCells(6), gridCells(5));
mainScene.addChild(hero);


// Add camera
const camera = new Camera();
mainScene.addChild(camera);


// Add an Input class to the main scene
mainScene.input = new Input();


// Establish update and draw loops
const update = (delta) => {
    mainScene.stepEntry(delta, mainScene)
};

const draw = () => {
    // Clear anything stale
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    skySprite.draw(ctx, 0, 0);
    // Svae the current state (for camera offset)
    ctx.save();

    // Offset by camera position
    ctx.translate(camera.position.x, camera.position.y);
    
    // Draw objects in the mounted scene
    mainScene.draw(ctx, 0, 0);

    // Restore to original state
    ctx.restore();
}


// Start the game!
const gameLoop = new GameLoop(update, draw)
gameLoop.start();