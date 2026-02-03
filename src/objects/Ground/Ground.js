import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { Sprite } from "../../Sprite";
import { resources } from "../../Resource";
import { FLOOR_Y } from "../../world/worldConstants";
import { DEBUG } from "../../debug";

// Pixel row inside ground4.png that represents the walkable surface
const walkableSurfaceY = 125;

export class Ground extends GameObject {
    constructor() {

        

        super({ position: new Vector2(0, FLOOR_Y - walkableSurfaceY) });

        // Change these depending on image used
        this.tileWidth = 185;
        this.tileHeight = 180;
        this.surfaceOffset = walkableSurfaceY;
    }

    drawImage(ctx, x, y) {
        const ground = resources.images.ground;
        if (!ground.isLoaded) return;

        const img = ground.image;
    
        // cavvas width is 320
        const canvasWidth = 320;

        // Where does the visible world start?
        const startX = Math.floor(x / this.tileWidth) * this.tileWidth - this.tileWidth;

        // How many tiles needed to cover screen
        const tilesNeeded = Math.ceil(canvasWidth / this.tileWidth) + 3;

        for (let i = 0; i < tilesNeeded; i++) {
            ctx.drawImage(img, startX + i * this.tileWidth, y);
        }

        // FOR DEBUGGING:
        // Show where ground is being drawn (top-left)
        if (DEBUG) {
            ctx.fillStyle = "magenta";
            ctx.fillRect(x, y, 6, 6);
            
            // Show where the ground thinks its surface is (should align with green debug line)
            ctx.fillStyle = "cyan";
            ctx.fillRect(-10000, y + this.surfaceOffset, 20000, 1);
        }
    }
}