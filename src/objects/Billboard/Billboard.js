import { GameObject } from "../../GameObject";
import { resources } from "../../Resource";
import { Vector2 } from "../../Vector2";
import { wrapText } from "../../helpers/wrapText";
import { FLOOR_Y } from "../../world/worldConstants";

export class Billboard extends GameObject {
    constructor(x, y) {
        super({ position: new Vector2(x, y) });

        this.width = 220;
        this.height = 110;
        this.headerH = 24;
        this.pad = 10;

        this.title = "PROJECTS";
        this.content = "FitSnap is mobile fitness app that tracks your location on runs, tracking heart rate, speed, and distance."
        
        this.imageKey = null;

        this.drawLayer = 10;
    }

    drawImage(ctx, x, y) {
        const w = this.width;
        const h = this.height;

        x = Math.round(x);
        y = Math.round(y);

        // Scale factor
        const s = Math.min(w / 220, h / 110);

        const frame = Math.max(2, Math.round(4 *s)); // yellow frame thickness
        const panelPad = Math.max(1, Math.round(2 * s)); // inner black boder padding
        const headerH = Math.max(14, Math.round(22 * s)); // header height
        const pad = Math.max(6, Math.round(10 * s)); // inside padding

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(x + 6, y + 6, w - 2, h - 2);

        // Outer yellow frame
        ctx.fillStyle = "#f1b51c";
        ctx.fillRect(x, y, w, h);

        // Inner black border
        ctx.fillStyle = "#2b1b14";
        ctx.fillRect(x + frame, y + frame, w - frame * 2, h - frame * 2);

        // Main panel
        ctx.fillStyle = "#3a241d";
        ctx.fillRect(
            x + frame + panelPad,
            y + frame + panelPad,
            w - (frame + panelPad) * 2,
            h - (frame + panelPad) * 2
        );

        // Inner content area (below header)
        const innerX = x + frame + panelPad;
        const innerY = y + frame + panelPad + headerH;
        const innerW = w - (frame + panelPad) * 2;
        const innerH = h - (frame + panelPad) * 2 - headerH;

        // Subtle vertical gradient on content panel
        const g = ctx.createLinearGradient(0, innerY, 0, innerY + innerH);
        g.addColorStop(0, "rgba(255,255,255,0.06)");
        g.addColorStop(1, "rgba(0,0,0,0.12)");
        ctx.fillStyle = g;
        ctx.fillRect(innerX, innerY, innerW, innerH);

        // Scanlines
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        for (let yy = innerY; yy < innerY + innerH; yy += 3) {
            ctx.fillRect(innerX, yy, innerW, 1);
        }

        // Photo box
        const photoH = Math.min(innerH - pad * 2, Math.round(42 * s));
        const photoW = photoH;

        const photoX = innerX + pad;
        const photoY = innerY + pad;

        const photoFrame = Math.max(1, Math.round(2 * s));
        ctx.fillStyle = "#d9d9d9";
        ctx.fillRect(photoX - photoFrame, photoY - photoFrame, photoW + photoFrame * 2, photoH + photoFrame * 2);

        ctx.fillStyle = "#111"; // Inner dark photo background (until you add real image)
        ctx.fillRect(photoX, photoY, photoW, photoH);

        if (this.imageKey) {
            const res = resources.images[this.imageKey];
            if (res && res.isLoaded) {
                ctx.drawImage(res.image, photoX, photoY, photoW, photoH);
            }
        }

        ctx.fillStyle = "rgba(255,255,255,0.12)"; // Shine on photo
        ctx.fillRect(photoX, photoY, photoW, 10);

        // Header bar
        ctx.fillStyle = "#f1b51c";
        ctx.fillRect(x + frame + panelPad, y + frame + panelPad, w - (frame + panelPad) * 2, headerH);

        // Title text
        const titleSize = Math.max(8, Math.round(10 * s));
        ctx.fillStyle = "#1a1a1a";
        ctx.font = `${titleSize}px monospace`;
        ctx.textBaseline = "middle";
        ctx.fillText(this.title, Math.round(innerX + pad), Math.round(y + frame + panelPad + headerH / 2));

        // Content text
        const bodySize = Math.max(6, Math.round(7 * s));
        const lineH = Math.max(10, Math.round(12 * s));
        ctx.font = `${bodySize}px monospace`;
        ctx.textBaseline = "top";
        ctx.fillStyle = "#e8e8e8";

        const textX = photoX + photoW + pad;
        const textY = photoY;
        const textW = innerX + innerW - pad - textX;

        wrapText(ctx, this.content, Math.round(textX), Math.round(textY), textW, lineH);


        // Billboard legs
        ctx.fillStyle = "#212121";

        const legTop = y + h;
        const maxLegLen = 20; // tweak for leg length
        const legBottom = Math.min(FLOOR_Y, legTop + maxLegLen);
        const legWidth = Math.max(3, Math.round(4 * s));

        const leftLegX = x + Math.round(w * 0.22);
        const rightLegX = x + Math.round(w * 0.78);

        ctx.fillRect(leftLegX, legTop, legWidth, legBottom - legTop);
        ctx.fillRect(rightLegX, legTop, legWidth, legBottom - legTop);
    }
}