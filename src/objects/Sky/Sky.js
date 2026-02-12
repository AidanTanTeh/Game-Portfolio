import { GAME_HEIGHT, GAME_WIDTH, WORLD_MAX_X } from "../../world/worldConstants";
import { events } from "../../Events";

const SKY_STOPS = [
    { p: 0.00, top: [110,190,255], bot: [200,235,255] },
    { p: 0.25, top: [30,110,220],  bot: [70,155,240]  },
    { p: 0.50, top: [255,130,40],  bot: [255,200,80]  },
    { p: 0.70, top: [100,30,140],  bot: [170,80,190]  },
    { p: 1.00, top: [5,8,30],      bot: [15,25,70]    },
];

const CLOUDS = Array.from({ length: 6 }, (_, i) => ({
    x: (i / 6) * GAME_WIDTH + Math.random() * 40,
    y: 18 + Math.random() * 35,
    w: 28 + Math.floor(Math.random() * 24),
    h: 7 + Math.floor(Math.random() * 6),
}));

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

    draw(ctx, cameraX = 0) {
        const W = GAME_WIDTH;
        const H = GAME_HEIGHT;

        const p = this.progress;

        // Blend day and night colours
        const { top, bot } = getSkyColors(this.progress);

        // Vertical gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, rgb(top));
        grad.addColorStop(1, rgb(bot));

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Clouds
        const cloudAlpha = Math.max(0, 1 - (p - 0.40) / 0.20);
        if (cloudAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = cloudAlpha;

            const parallaxOffset = (cameraX * -0.15) % GAME_WIDTH;

            ctx.fillStyle = "rgba(255,255,255,0.88)";
            for (const cloud of CLOUDS) {
                const cx = cloud.x + parallaxOffset;
                ctx.fillRect(cx, cloud.y, cloud.w, cloud.h);
            }

            ctx.restore();
        }
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

function getSkyColors(progress) {
    let s0 = SKY_STOPS[0];
    let s1 = SKY_STOPS[SKY_STOPS.length - 1];

    for (let i = 0; i < SKY_STOPS.length - 1; i++) {
        if (progress >= SKY_STOPS[i].p && progress <= SKY_STOPS[i + 1].p) {
            s0 = SKY_STOPS[i];
            s1 = SKY_STOPS[i + 1];
            break;
        }
    }

    const range = s1.p - s0.p || 1;
    const t = (progress - s0.p) / range;

    return {
        top: lerpColor(s0.top, s1.top, t),
        bot: lerpColor(s0.bot, s1.bot, t),
    };
}

