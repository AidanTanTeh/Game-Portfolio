import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { FLOOR_Y } from "../../world/worldConstants";
import { events } from "../../Events";

export class Pipe extends GameObject {
    constructor(x, y) {
        super({ position: new Vector2(x, y) });

        this.w = 34;
        this.h = 34;

        // Entrance area (top opening)
        this.entranceW = 18;
        this.entranceH = 6;

        this.triggered = false;
        this.drawLayer = 2;
    }

    step(delta, root) {
        if (this.triggered) return;

        const hero = root?.hero;
        if (!hero) return;
        if (!hero.justLanded) return;

        // Check hero is landing near the pipe top opening
        const pipeCenterX = this.position.x;
        const heroX = hero.position.x;
        const heroY = hero.position.y;

        // Hero lands at FLOOR_Y
        const closeToFloor = Math.abs(heroY - FLOOR_Y) <= 1;
        if (!closeToFloor) return;

        const withinX =
        heroX >= pipeCenterX - this.entranceW / 2 &&
        heroX <= pipeCenterX + this.entranceW / 2;

        if (!withinX) return;

        // Trigger pipe entry
        this.triggered = true;

        const rimH = 10;
        const rimTopY = this.position.y - this.h - rimH + 2;
        const rimBottomY = rimTopY + rimH - 8;
        hero.enterPipe(pipeCenterX, rimBottomY);
        
        setTimeout(() => {
            events.emit("PIPE_FOUND");
        }, 850);
    }

    drawImage(ctx, x, y) {
        const px = Math.round(x);
        const py = Math.round(y);

        const w = this.w;
        const h = this.h;

        // Colors
        const dark = "#0a6a2a";
        const mid = "#18a84a";
        const light = "#33d06a";
        const rim = "#1dd65c";

        // Body
        ctx.fillStyle = dark;
        ctx.fillRect(px - w / 2, py - h, w, h);

        // Inner shade
        ctx.fillStyle = mid;
        ctx.fillRect(px - w / 2 + 3, py - h + 3, w - 6, h - 6);

        // Left highlight
        ctx.fillStyle = light;
        ctx.fillRect(px - w / 2 + 3, py - h + 3, 5, h - 6);

        // Rim (top lip)
        const rimH = 10;
        const rimTopY = py - h - rimH + 2;
        const rimBottomY = rimTopY + rimH;

        ctx.fillStyle = rim;
        ctx.fillRect(px - w / 2 - 2, rimTopY, w + 4, rimH);

        // Rim outline-ish
        ctx.fillStyle = dark;
        ctx.fillRect(px - w / 2 - 2, rimTopY, w + 4, 2);
    }
}
