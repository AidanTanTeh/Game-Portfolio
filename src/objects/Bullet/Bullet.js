import { DEBUG } from "../../debug";
import { GameObject } from "../../GameObject";
import { isSpaceFree } from "../../helpers/grid";
import { FLOOR_Y, WORLD_MAX_X, WORLD_MIN_X } from "../../world/worldConstants";
import { walls } from "../../levels/level1";

export class Bullet extends GameObject {
    constructor({ position, velocity, lifeMs = 900}) {
        super({ position });
        this.velocity = velocity;
        this.lifeMs = lifeMs;

        // Small rectangle for bullets
        this.w = 2;
        this.h = 2;
    }

    step(delta) {
        // Delta converted from milliseconds to seconds
        const dt = delta / 1000;

        // Move bullet (distance = speed * time)
        const nextX = this.position.x + this.velocity.x * dt;
        const nextY = this.position.y + this.velocity.y * dt;

        // World bounds
        if (nextX < WORLD_MIN_X - 50 || nextX > WORLD_MAX_X + 50) {
            this.destroy();
            return;
        }

        // Floor collision
        if (nextY >= FLOOR_Y) {
            this.destroy();
            return;
        }

        // Wall collision
        const canMove = isSpaceFree(walls, nextX, nextY);
        if (!canMove) {
            this.destroy();
            return;
        }

        this.position.x = nextX;
        this.position.y = nextY;

        // Countdown lifespan
        this.lifeMs -= delta;
        if (this.lifeMs <= 0) {
            this.destroy();
        }
    }

    drawImage(ctx, x, y) {
        ctx.fillStyle = "grey";
        ctx.fillRect(x, y, this.w, this.h);
    }
}