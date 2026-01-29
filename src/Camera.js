import { GameObject } from "./GameObject";
import { events } from "./Events";
import { Vector2 } from "./Vector2";

export class Camera extends GameObject {
    constructor() {
        super({});

        events.on("HERO_POSITION", this, heroPosition => {
            
            // Create a new position based on the hero's position
            const personHalf = 0;
            const canvasWidth = 320;
            const canvasHeight = 180;
            const halfWidth = -personHalf + canvasWidth / 2;
            const halfHeight = -personHalf + canvasHeight / 2;

            this.position = new Vector2(
                -heroPosition.x + halfWidth,
                0 // y set to zero to prevent camera moving when hero jumps
                // -heroPosition.y + halfHeight,
            )
        })
    }
}