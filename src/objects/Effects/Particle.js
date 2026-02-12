import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";

export class Particle extends GameObject {
    constructor({ x, y, vx, vy, colour, size, lifeMs }) {
        super({ position: new Vector2(x, y )});

        // Velocity
        this.vx = vx;
        this.vy = vy;

        // Colour and size
        this.colour = colour;
        this.size = size;

        // Lifespan
        this.lifeMs = lifeMs;
        this.maxLifeMs = lifeMs;

        // Draw layer
        this.drawLayer = 100;
    }

    step(delta) {
        const dt = delta / 1000;

        // Distance = velocity * time
        this.position.x += this.vx * dt;
        this.position.y += this.vy * dt;

        // Slow effect
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Countdown lifespan
        this.lifeMs -= delta;

        if (this.lifeMs <= 0) {
            this.destroy();
        }
    }

    drawImage(ctx, x, y) {
        // Fade effect
        const alpha = Math.max(0, this.lifeMs / this.maxLifeMs);

        ctx.save();

        // Make particle semi transpy
        ctx.globalAlpha = alpha;

        // Draw particle
        const shrink = Math.max(1, this.size * alpha);

        ctx.fillStyle = this.colour;
        ctx.fillRect(x, y, shrink, shrink);

        ctx.restore();
    }
}