import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { events } from "../../Events";

export class Sign extends GameObject {
    constructor(x, y) {
        super({ position: new Vector2(x, y) });

        this.w = 18;
        this.h = 14;
        this.triggerW = 16;
        this.triggerH = 10;

        this.triggered = false;
        this.drawLayer = 2;

        // Trigger when hero overlaps
        events.on("HERO_POSITION", this, (pos) => {
            if (this.triggered) return;

            const hx = pos.x;
            const hy = pos.y;

            const left = this.position.x - this.triggerW / 2;
            const right = this.position.x + this.triggerW / 2;
            const top = this.position.y - this.triggerH;
            const bot = this.position.y;

            const inside = hx >= left && hx <= right && hy >= top && hy <= bot;

            if (inside) {
                this.triggered = true;
                events.emit("SHOW_TUTORIAL");
            }
        });
    }

    drawImage(ctx, x, y) {
        const px = Math.round(x);
        const py = Math.round(y);

        // Post
        ctx.fillStyle = "#6b4a2b";
        ctx.fillRect(px - 1, py - 8, 2, 10);
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(px, py - 8, 1, 10);

        // Board
        ctx.fillStyle = "#a0723a";
        ctx.fillRect(px - 9, py - 16, 18, 10);

        // Board border
        ctx.fillStyle = "#6b4a2b";
        ctx.fillRect(px - 9, py - 16, 18, 1);
        ctx.fillRect(px - 9, py - 7, 18, 1);
        ctx.fillRect(px - 9, py - 16, 1, 10);
        ctx.fillRect(px + 8, py - 16, 1, 10);

        // Text lines
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(px - 6, py - 13, 12, 1);
        ctx.fillRect(px - 6, py - 11, 10, 1);
        ctx.fillRect(px - 6, py - 9, 8, 1);
    }
}
