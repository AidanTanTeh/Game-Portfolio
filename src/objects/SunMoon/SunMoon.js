import { WORLD_MAX_X } from "../../world/worldConstants";
import { events } from "../../Events";
import { clamp01 } from "../../helpers/clamp01";

const SUN_END = 0.5;
const MOON_START = 0.5;

export class SunMoon {
    constructor() {
        this.time = 0;
        this.progress = 0;
        this.progressSmooth = 0;

        this.heroX = 0;
        events.on("HERO_POSITION", this, (pos) => {
            this.heroX = pos.x;
        });
    }

    step(delta) {
        this.time += delta;
    }

    draw(ctx, W, H) {
        this.progress = clamp01(this.heroX / WORLD_MAX_X);
        this.progressSmooth += (this.progress - this.progressSmooth) * 0.10;
        const p = this.progressSmooth;

        if (p <= SUN_END) {
            const t = clamp01(p / SUN_END); // normalize to 0..1
            this.drawSun(ctx, W, H, t, p);
        } else {
            const t = clamp01((p - MOON_START) / (1 - MOON_START));
            this.drawMoon(ctx, W, H, t, p);
        }
    }

    drawSun(ctx, W, H, t, p) {
        const base = 0.85;
        const arc = 0.60;

        const sunX = W * (0.90 - 0.80 * t);
        const sunY = H * base - Math.sin(t * Math.PI) * H * arc;

        const fadeOut = p > 0.50 ? clamp01(1 - (p - 0.50) / 0.15) : 1;

        ctx.save();
        ctx.globalAlpha = fadeOut;

        // Glow effect
        const outerR = 18;
        const glow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, outerR);
        glow.addColorStop(0, "rgba(255,245,180,0.55)");
        glow.addColorStop(1, "rgba(255,200,50,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(sunX - outerR, sunY - outerR, outerR * 2, outerR * 2);

        // Pixel body
        const x = Math.round(sunX);
        const y = Math.round(sunY);

        ctx.fillStyle = "#ffffc0";
        ctx.fillRect(x - 4, y - 4, 8, 8);
        ctx.fillRect(x - 6, y - 2, 2, 4);
        ctx.fillRect(x + 4, y - 2, 2, 4);
        ctx.fillRect(x - 2, y - 6, 4, 2);
        ctx.fillRect(x - 2, y + 4, 4, 2);

        ctx.restore();
    }

    drawMoon(ctx, W, H, t, p) {
        const base = 0.85;
        const arc = 0.60;

        const moonX = W * (0.90 - 0.80 * t);
        const moonY = H * base - Math.sin(t * Math.PI) * H * arc;

        const fadeIn = clamp01((p - MOON_START) / 0.10);

        ctx.save();
        ctx.globalAlpha = fadeIn;

        const x = Math.round(moonX);
        const y = Math.round(moonY);

        ctx.fillStyle = "#d8eeff";
        ctx.fillRect(x - 4, y - 4, 8, 8);
        ctx.fillRect(x - 3, y - 5, 6, 1);
        ctx.fillRect(x - 3, y + 4, 6, 1);
        ctx.fillRect(x - 5, y - 3, 1, 6);
        ctx.fillRect(x + 4, y - 3, 1, 6);

        ctx.restore();
    }
}