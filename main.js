import './style.css'
import { Vector2 } from './src/Vector2';
import { GameLoop } from "./src/GameLoop";;
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
import { Sky } from "./src/objects/Sky/Sky";
import { SunMoon } from './src/objects/SunMoon/SunMoon';
import { WORLD_MAX_X, WORLD_MIN_X } from './src/world/worldConstants';
import { Buildings } from './src/objects/Buildings/Buildings';
import { Sign } from './src/objects/Sign/Sign';
import { StartScreenUI } from './src/ui/StartScreenUI';
import { PauseManager } from './src/game/PauseManager';
import { SignModal } from './src/ui/SignModal';
import { PortfolioSummary } from './src/ui/PortfolioSummary';
import { PipeModal } from './src/ui/PipeModal';
import { Pipe } from './src/objects/Pipe/Pipe';

// Grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const portfolioPage = document.getElementById("portfolio-page");

// Add background for game
const sky = new Sky();
const sunMoon = new SunMoon();
const buildings = new Buildings();

// Establish the root scene
const mainScene = new GameObject({
    position: new Vector2(0, 0)
});

// Add an Input class to the main scene
mainScene.input = new Input();

// Add mouse
const mouse = new Mouse(canvas);
mainScene.mouse = mouse;

// Add pause manager
const pauseManager = new PauseManager({
    input: mainScene.input,
    mouse,
    canvas
});

// Add sign modal
const signModal = new SignModal({
    pauseManager
});

// Add pipe modal
const pipeModal = new PipeModal({ pauseManager });


// Add start screen
const startUI = new StartScreenUI();

pauseManager.setPaused(true);
startUI.show();

events.on("START_GAME", mainScene, () => {
    startUI.hide();

    // hide portfolio page
    portfolioPage?.classList.add("hidden");

    // disable scrolling
    document.body.classList.remove("allow-scroll");

    pauseManager.setPaused(false);
});

const portfolioSummary = new PortfolioSummary();

events.on("SKIP_GAME", mainScene, () => {
    startUI.hide();

    // show portfolio
    portfolioPage?.classList.remove("hidden");

    // enable scrolling 
    document.body.classList.add("allow-scroll");

    pauseManager.setPaused(true);
    canvas.style.cursor = "default";

    // Scroll to portfolio section
    portfolioPage?.scrollIntoView({ behavior: "smooth" });
});

// Add camera
const camera = new Camera();
mainScene.addChild(camera);
mainScene.camera = camera;

// Add ground
const ground = new Ground();
mainScene.addChild(ground);

// Add player
const hero = new Hero(WORLD_MIN_X, FLOOR_Y - 200);
mainScene.addChild(hero);
mainScene.hero = hero;

// Add gun
const gun = new Gun(gridCells(6), FLOOR_Y);
mainScene.addChild(gun);

// Add sign
const sign = new Sign(gridCells(3), FLOOR_Y);
mainScene.addChild(sign);

// Add pipe
const pipe = new Pipe(WORLD_MAX_X - gridCells(4), FLOOR_Y);
mainScene.addChild(pipe);

// Add bullets
events.on("SPAWN_BULLET", mainScene, ({ position, velocity }) => {
    mainScene.addChild(
        new Bullet({
            position,
            velocity,
            lifeMs: 900,
        })
    )
});

// Add billboard / boxes
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

// Sign triggers tutorial
events.on("SHOW_TUTORIAL", mainScene, () => {
    signModal.show();
});

// Pipe found
events.on("PIPE_FOUND", mainScene, () => {
    pipeModal.show();
});


// Establish update and draw loops
const update = (delta) => {
    mouse.updateWorld(camera);

    if (pauseManager.isPaused) {
        // Don’t step the scene
        mainScene.input.clearFrameInputs();
        mouse.clearFrameInputs();
        return;
    }

    mainScene.stepEntry(delta, mainScene);
    sky.step(delta);
    sunMoon.step(delta);

    mainScene.input.clearFrameInputs();
    mouse.clearFrameInputs();
};

const draw = () => {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;

    // Clear anything stale
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sky.draw(ctx, camera.position.x);
    sunMoon.draw(ctx, W, H);
    buildings.draw(ctx, camera.position.x);

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

    // Draw mouse reticle
    if (!pauseManager.isPaused && hero.hasGun) drawReticle(ctx, mouse);
}

// Start the game!
const gameLoop = new GameLoop(update, draw)
gameLoop.start();