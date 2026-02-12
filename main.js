import './style.css'
import { resources } from './src/Resource';
import { Sprite } from './src/Sprite';
import { Vector2 } from './src/Vector2';
import { GameLoop } from './src/Gameloop';
import { Input } from './src/Input';
import { gridCells } from './src/helpers/grid';
import { GameObject } from './src/GameObject';
import { Hero } from './src/objects/Hero/Hero';
import { Camera } from './src/Camera';
import { Ground } from './src/objects/Ground/Ground';
import { FLOOR_Y } from './src/world/worldConstants';
import { DEBUG } from './src/debug';
import { Gun } from './src/objects/Gun/Gun';
import { Mouse } from './src/Mouse';
import { drawReticle } from './src/ui/reticle';
import { Bullet } from './src/objects/Bullet/Bullet';
import { events } from './src/Events';
import { Box } from './src/objects/Box/Box';
import { Explosion } from './src/objects/Effects/Explosion';
import { Billboard } from './src/objects/Billboard/Billboard';
import { PORTFOLIO_SECTIONS } from './src/portfolioSections';
import { getSectionById } from './src/helpers/billboardSections';
import { Sky } from './src/objects/Sky/Sky';

// Grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const sky = new Sky();

// Establish the root scene
const mainScene = new GameObject({
    position: new Vector2(0, 0)
});

events.on("SPAWN_BULLET", mainScene, ({ position, velocity }) => {
    mainScene.addChild(
        new Bullet({
            position,
            velocity,
            lifeMs: 900,
        })
    )
});

// Add mouse
const mouse = new Mouse(canvas);
mainScene.mouse = mouse;

// Add ground
const ground = new Ground();
mainScene.addChild(ground);

// Add player
const hero = new Hero(gridCells(6), FLOOR_Y);
mainScene.addChild(hero);

// Add gun
const gun = new Gun(gridCells(9), FLOOR_Y);
mainScene.addChild(gun);

// Add billboard sections
const revealed = new Set();

PORTFOLIO_SECTIONS.forEach((section) => {
    const box = new Box(section.triggerX, section.boxY ?? (FLOOR_Y - 40), section.id);
    mainScene.addChild(box);
});

events.on("BOX_EXPLODE", mainScene, ({ x, y, sectionId }) => {
    // Prevent duplicates
    if (revealed.has(sectionId)) return;
    revealed.add(sectionId);
    
    // Add explosion
    mainScene.addChild(new Explosion(x, y, "#ffcc00"));

    // Add billboard
    const section = getSectionById(sectionId);
    if (!section) return;

    const ox = section.billboardOffset?.x ?? -110;
    const oy = section.billboardOffset?.y ?? -80;

    const bb = new Billboard(Math.round(x + ox), Math.round(y + oy));
    bb.title = section.title;
    bb.content = section.content;

    bb.imageKey = section.imageKey;

    mainScene.addChild(bb);
});

// Add camera
const camera = new Camera();
mainScene.addChild(camera);
mainScene.camera = camera;


// Add an Input class to the main scene
mainScene.input = new Input();


// Establish update and draw loops
const update = (delta) => {
    sky.step(delta);
    mainScene.stepEntry(delta, mainScene);

    // Convert mouse screen coords to world coords using camera
    mouse.updateWorld(camera);

    mainScene.input.clearFrameInputs();
    mouse.clearFrameInputs();
};

const draw = () => {
    // Clear anything stale
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sky.draw(ctx, camera.position.x);

    // skySprite.draw(ctx, 0, 0);
    // Svae the current state (for camera offset)
    ctx.save();

    // Offset by camera position
    ctx.translate(camera.position.x, camera.position.y);
    
    // Draw objects in the mounted scene
    mainScene.draw(ctx, 0, 0);

    // FOR DEBUGGING: floor line
    if (DEBUG) {
        ctx.fillStyle = "lime";
        ctx.fillRect(-10000, FLOOR_Y, 20000, 1);
    }

    // Restore to original state
    ctx.restore();

    drawReticle(ctx, mouse);
}

// Start the game!
const gameLoop = new GameLoop(update, draw)
gameLoop.start();