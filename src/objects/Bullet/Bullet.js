import { DEBUG } from "../../debug";
import { GameObject } from "../../GameObject";

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
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

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