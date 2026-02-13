export class Buildings {
  constructor() {
    // Far background scroll speed (smaller = moves slower)
    this.parallax = 0.22;

    this.horizonYRatio = 0.88;

    // One chunk of skyline that repeats
    this.patternWidth = 420;

    // Buildings are defined inside the chunk (x is 0..patternWidth)
    this.pattern = [
      { x: 10, w: 40, h: 50, body: "#7b848c", top: "#555c63" },
      { x: 60, w: 70, h: 75, body: "#9aa0a6", top: "#2f3338", label: "UNSW" },
      { x: 150, w: 50, h: 60, body: "#6f7880", top: "#4f565d" },
      { x: 220, w: 60, h: 55, body: "#808a93", top: "#5b636a" },
      { x: 300, w: 45, h: 48, body: "#6b747c", top: "#4b5258" },
    ];
  }

  draw(ctx, cameraX) {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;

    const worldLeft = -cameraX;
    const horizonY = Math.floor(H * this.horizonYRatio);

    let offset = worldLeft * this.parallax;

    // Wrap offset
    offset = ((offset % this.patternWidth) + this.patternWidth) % this.patternWidth;

    ctx.save();
    ctx.globalAlpha = 1;

    // Draw repeated skyline chunks
    for (let chunkX = -this.patternWidth; chunkX < W + this.patternWidth; chunkX += this.patternWidth) {
      const baseX = chunkX - offset;

      for (const b of this.pattern) {
        const sx = Math.round(baseX + b.x);
        const sy = Math.round(horizonY - b.h);

        // Building body
        ctx.fillStyle = b.body;
        ctx.fillRect(sx, sy, b.w, b.h);

        // Top band
        ctx.fillStyle = b.top;
        ctx.fillRect(sx, sy, b.w, 16);

        // Windows
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        const pad = 8;
        const winW = 3;
        const winH = 3;
        const gapX = 8;
        const gapY = 8;

        for (let yy = sy + 26; yy < sy + b.h - pad; yy += gapY) {
          for (let xx = sx + pad; xx < sx + b.w - pad; xx += gapX) {
            ctx.fillRect(xx, yy, winW, winH);
          }
        }

        // UNSW label
        if (b.label) {
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `12px "Press Start 2P", monospace`;
          ctx.fillText(b.label, sx + b.w / 2, sy + 8);
        }
      }
    }

    ctx.restore();
  }
}
