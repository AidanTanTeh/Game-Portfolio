import { GAME_HEIGHT, GAME_WIDTH, WORLD_MAX_X } from "../../world/worldConstants";
import { events } from "../../Events";

const DAY_TOP = [110, 190, 255];
const DAY_BOT = [200, 235, 255];

const NIGHT_TOP = [5, 8, 30];
const NIGHT_BOT = [15, 25, 70];

export class Sky {
    constructor() {
        this.progress = 0; // based on hero position

        events.on("HERO_POSITION", this, (pos) => {
            // Converts hero x in world into progress (0..1)
            this.progress = Math.max(0, Math.min(1, pos.x / WORLD_MAX_X));
        });
    }

    step(delta) {
        //
    }

    draw(ctx) {
        const W = GAME_WIDTH;
        const H = GAME_HEIGHT;

        const p = this.progress;

        // Blend day and night colours
        const top = lerpColor(DAY_TOP, NIGHT_TOP, p);
        const bot = lerpColor(DAY_BOT, NIGHT_BOT, p);

        // Vertical gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, rgb(top));
        grad.addColorStop(1, rgb(bot));

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }
}

// PARALLAX EFFECT ////////////////////////////////////
// Lerp interpolation: blends a to b by (0..1)
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Blend two RGB arrays
function lerpColor(a, b, t) {
    return [
        Math.round(lerp(a[0], b[0], t)),
        Math.round(lerp(a[1], b[1], t)),
        Math.round(lerp(a[2], b[2], t)),
    ];
}

// Convert [r, g, b] to "rbg(r,g,b)""
function rgb(c) {
    return `rgb(${c[0]},${c[1]},${c[2]})`;
}

