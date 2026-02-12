import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { Particle } from "./Particle";

export class Explosion extends GameObject {
    constructor(x, y, colour) {
        super({ position: new Vector2(x, y) });

        this.colour = colour;
        this.spawned = false;

        this.drawLayer = 100;
    }

    step(delta) {
        if (this.spawned) return;

        this.spawned = true;

        for(let i = 0; i < 25; i++) {
            const vx = (Math.random() - 0.5) * 300;
            const vy = (Math.random() - 0.5) * 300;

            // Alternate colours
            const c = i % 2 === 0 ? this.colour : '#ff4400'

            // Random size and lifespan
            const size = 1 + Math.floor(Math.random() * 5);
            const life = 300 + Math.random() * 400;

            if (i === 0) console.log("sample vx/vy:", vx, vy);

            this.parent.addChild(
                new Particle({
                    x: this.position.x,
                    y: this.position.y,
                    vx,
                    vy, 
                    colour: c,
                    size, 
                    lifeMs: life,
                })
            );
        }

        this.destroy();
    }

    drawImage(ctx, x, y) {
        ctx.save();
        ctx.strokeStyle = "orange";
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}