import './style.css'
import { resources } from './src/Resource';
import { Sprite } from './src/Sprite';
import { Vector2 } from './src/Vector2';
import { GameLoop } from './src/Gameloop';
import { Input, LEFT, RIGHT, UP, DOWN } from './src/Input';
import { gridCells, isSpaceFree } from './src/helpers.js/grid';
import { moveTowards } from './src/helpers.js/moveTowards';
import { walls } from './src/levels/level1';

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const skySprite = new Sprite({
        resource: resources.images.sky,
        frameSize: new Vector2(320, 180)
})

const ground = new Sprite({
        resource: resources.images.ground,
        frameSize: new Vector2(320, 180)
})

const hero = new Sprite({
    resource: resources.images.hero,
    frameSize: new Vector2(32, 32),
    hFrames: 3,
    vFrames: 8,
    frame: 1,
    position: new Vector2(gridCells(5), gridCells(7))
})

const heroDestinationPosition = hero.position.duplicate();

const shadow = new Sprite({
    resource: resources.images.shadow,
    frameSize: new Vector2(32, 32)
})

const input = new Input();

const update = () => {

    const distance = moveTowards(hero, heroDestinationPosition, 1)
    const hasArrived = distance <= 1;
    // Attempt to move again if the hero is at his position
    if (hasArrived) {
        tryMove();
    }
};

const tryMove = () => {

    if (!input.direction) {
        return;
    }

    let nextX = heroDestinationPosition.x;
    let nextY = heroDestinationPosition.y;
    const gridSize = 16; // change for snappier movement

    if (input.direction === LEFT) {
        nextX -= gridSize;
        hero.frame = 9
    }
    if (input.direction === RIGHT) {
        nextX += gridSize;
        hero.frame = 3;
    }
    if (input.direction === UP) {
        nextY -= gridSize;
        hero.frame = 6;
    }
    if (input.direction === DOWN) {
        nextY += gridSize;
        hero.frame = 0;
    }

    // TODO - check if that space is free

    if (isSpaceFree(walls, nextX, nextY)) {
        heroDestinationPosition.x = nextX;
        heroDestinationPosition.y = nextY;
    }

}

const draw = () => {
    skySprite.drawImage(ctx, 0, 0);

    
    ground.drawImage(ctx, 0, 0);

    // for centering hero
    const heroOffset = new Vector2(-8, -21);
    const heroPosX = hero.position.x + heroOffset.x;
    const heroPosY = hero.position.y + 1 + heroOffset.y;

    shadow.drawImage(ctx, heroPosX, heroPosY);
    hero.drawImage(ctx, heroPosX, heroPosY);
}

const gameLoop = new GameLoop(update, draw)
gameLoop.start();