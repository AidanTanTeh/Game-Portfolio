import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { Sprite } from "../../Sprite";
import { resources } from "../../Resource";
import { gridCells } from "../../helpers/grid";
import { Animations } from "../../Animations";
import { FrameIndexPattern } from "../../FrameIndexPattern";
import { WALK_DOWN, WALK_UP, WALK_LEFT, WALK_RIGHT,
         STAND_DOWN, STAND_UP, STAND_LEFT, STAND_RIGHT } from "./heroAnimations";
import { DOWN, UP, LEFT, RIGHT } from "../../Input";
import { isSpaceFree } from "../../helpers/grid";
import { walls } from "../../levels/level1";
import { events } from "../../Events";
import { DEBUG } from "../../debug";
import { WORLD_MAX_X, WORLD_MIN_X } from "../../world/worldConstants";

export class Hero extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
        });

        this.moveSpeed = 80;

        this.body = new Sprite({
            resource: resources.images.hero,
            frameSize: new Vector2(32, 32),
            hFrames: 3,
            vFrames: 8,
            frame: 1,
            position: new Vector2(-16, -29),
            animations: new Animations({
                walkDown: new FrameIndexPattern(WALK_DOWN),
                walkUp: new FrameIndexPattern(WALK_UP),
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                standDown: new FrameIndexPattern(STAND_DOWN),
                standUp: new FrameIndexPattern(STAND_UP),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                standRight: new FrameIndexPattern(STAND_RIGHT),
            })
        });

        this.addChild(this.body);
        this.facingDirection = DOWN;
    }

    step(delta, root) {
        const { input } = root;

        // Convert delta to seconds
        const dt = delta / 1000;

        // Direction intent
        let dx = 0;
        let dy = 0;

        if (input.direction === LEFT) dx = -1;
        else if (input.direction === RIGHT) dx = 1;

        if (input.direction === UP) dy = -1;
        else if (input.direction === DOWN) dy = 1;

        // Animations + facing
        if (!input.direction) {
            if (this.facingDirection === LEFT) this.body.animations.play("standLeft");
            if (this.facingDirection === RIGHT) this.body.animations.play("standRight");
            if (this.facingDirection === UP) this.body.animations.play("standUp");
            if (this.facingDirection === DOWN) this.body.animations.play("standDown");
        } else {
            if (input.direction === LEFT) this.body.animations.play("walkLeft");
            if (input.direction === RIGHT) this.body.animations.play("walkRight");
            if (input.direction === UP) this.body.animations.play("walkUp");
            if (input.direction === DOWN) this.body.animations.play("walkDown");

            this.facingDirection = input.direction ?? DOWN; // To stay at direction of last pressed key
            // this.facingDirection = DOWN;
        }

        // If no movement, just emit position  (if changed) and exit        const distance = moveTowards(this, this.destinationPosition, 1)
        if (dx === 0 && dy === 0) {
            this.tryEmitPosition();
            return;
        }

        // New position using speed
        const amount = this.moveSpeed * dt;
        let nextX = this.position.x + dx * amount;
        let nextY = this.position.y + dy * amount;

        // Hero movement clamp
        nextX = Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, nextX));

        // Check if can move
        const canMove = isSpaceFree(walls, nextX, nextY);

        if (canMove) {
            this.position.x = nextX;
            this.position.y = nextY;
        }

        this.tryEmitPosition() 
    }

    tryEmitPosition() {
        if (this.lastX === this.position.x && this.lastY === this.position.y) {
            return;
        }
        this.lastX = this.position.x;
        this.lastY = this.position.y;
        events.emit("HERO_POSITION", this.position);
    }

    drawImage(ctx, x, y) {
        // FOR DEBUGGING:
        if (DEBUG) {
            // Hero anchor point (should be at hero's feet)
            ctx.fillStyle = "red";
            ctx.fillRect(x - 1, y - 1, 3, 3);

            // Show where the 32x32 sprite box is drawn
            // body.position is relative to anchor
            const bx = x + this.body.position.x;
            const by = y + this.body.position.y;
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(bx, by, 32, 32);

            // Show bottom of sprite box
            ctx.fillStyle = "orange";
            ctx.fillRect(bx, by + 32, 32, 1);
        }
    }
}