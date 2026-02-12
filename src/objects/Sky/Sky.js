import { GAME_HEIGHT, GAME_WIDTH, WORLD_MAX_X } from "../../world/worldConstants";
import { events } from "../../Events";
import { clamp01 } from "../../helpers/clamp01";

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

const STARS = Array.from({ length: 60 }, () => ({
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * (GAME_HEIGHT * 0.55),
    size: Math.random() < 0.7 ? 1 : 2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.004 + Math.random() * 0.003,
}));

export class Sky {
    constructor() {
        this.heroX = 0;
        this.progress = 0;
        this.progressSmooth = 0;
        this.time = 0;

        events.on("HERO_POSITION", this, (pos) => {
            this.heroX = pos.x;
            this.progress = clamp01(this.heroX / WORLD_MAX_X);
        });
    }

    step(delta) {
        this.time += delta;
    }

    draw(ctx, cameraX = 0) {
        const W = ctx.canvas.width;
        const H = ctx.canvas.height;

        const worldLeft = -cameraX;

        this.progressSmooth += (this.progress - this.progressSmooth) * 0.06;
        const p = this.progressSmooth;

        // Blend day and night colours
        const { top, bot } = getSkyColors(p);

        // Vertical gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, rgb(top));
        grad.addColorStop(1, rgb(bot));

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Stars
        if (p > 0.35 && p < 0.88) {
            const glowStr = p < 0.55 
                ? (p - 0.35) / 0.20      // fade in
                : 1 - (p - 0.55) / 0.25; // fade out

            const hGlow = ctx.createLinearGradient(0, H * 0.55, 0, H);
            hGlow.addColorStop(0, "rgba(255,120,30,0)");
            hGlow.addColorStop(1, `rgba(255,80,0,${(glowStr * 0.28).toFixed(3)})`);

            ctx.fillStyle = hGlow;
            ctx.fillRect(0, H * 0.55, W, H * 0.45);
        }

        const starAlpha = Math.max(0, Math.min(1, (p - 0.50) / 0.20));
        if (starAlpha > 0) {
            ctx.save();
            ctx.fillStyle = "#fff";

            const starParallax = 0.03;
            const starOffset = (-worldLeft * starParallax) % W;
           
            for (const s of STARS) {
                // Twinkle between 0.6-1.0
                const twinkle = 0.8 + 0.2 * Math.sin(this.time * s.speed + s.phase);
                ctx.globalAlpha = starAlpha * twinkle;
                
                let sx = s.x + starOffset;
                sx = ((sx % W) + W) % W;

                ctx.fillRect(sx, s.y, s.size, s.size);
            }

            ctx.restore();
        }

        // Clouds
        const cloudAlpha = Math.max(0, 1 - (p - 0.40) / 0.20);
        if (cloudAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = cloudAlpha;

            const cloudParallax = 0.13;
            const parallaxOffset = (-worldLeft * cloudParallax) % W;

            ctx.fillStyle = "rgba(255,255,255,0.88)";
            for (const cloud of CLOUDS) {
                // Move cloud by parallax
                let cx = cloud.x + parallaxOffset;

                cx = ((cx % (W + cloud.w)) + (W + cloud.w)) % (W + cloud.w) - cloud.w;

                const cy = cloud.y;
                const cw = cloud.w;
                const ch = cloud.h;

                // main body
                ctx.fillRect(cx, cy + Math.floor(ch * 0.4), cw, Math.ceil(ch * 0.6));

                // upper bumps
                const b1W = Math.floor(cw * 0.38);
                const b2W = Math.floor(cw * 0.32);

                ctx.fillRect(cx + Math.floor(cw * 0.12), cy, b1W, ch);
                ctx.fillRect(cx + Math.floor(cw * 0.54), cy + Math.floor(ch * 0.18), b2W, Math.ceil(ch * 0.82));
            }

            ctx.restore();
        }
    }
}

// PARALLAX HELPERS
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
