import { DEBUG } from "../../debug";
import { GameObject } from "../../GameObject";
import { isSpaceFree } from "../../helpers/grid";
import { FLOOR_Y, WORLD_MAX_X, WORLD_MIN_X } from "../../world/worldConstants";
import { walls } from "../../levels/level1";
import { rectsIntersect } from "../../helpers/collisions";

export class Bullet extends GameObject {
    constructor({ position, velocity, lifeMs = 900}) {
        super({ position });
        this.velocity = velocity;
        this.lifeMs = lifeMs;

        // Small rectangle for bullets
        this.w = 2;
        this.h = 2;

        this.drawLayer = 11;
    }

    step(delta, root) {
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

        const bulletBox = {
            x: this.position.x,
            y: this.position.y,
            w: this.w,
            h: this.h,
        };

        // Look for shootable targets among root children
        for (const obj of root.children) {
            if (!obj.isShootable || typeof obj.getHitbox !== "function") continue;
        
            const targetBox = obj.getHitbox();
            if (rectsIntersect(bulletBox, targetBox)) {
                // Tell target it got hit
                if (typeof obj.onBulletHit === "function") obj.onBulletHit();
                
                this.destroy();
                return;
            }
        }
    }

    drawImage(ctx, x, y) {
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, this.w, this.h);
    }
}