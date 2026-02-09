export function drawReticle(ctx, mouse) {
    const x = Math.round(mouse.screen.x);
    const y = Math.round(mouse.screen.y);

    ctx.save();
    ctx.fillStyle = "red";

    // Center dot
    ctx.fillRect(x, y, 1, 1);

    // Crosshair arms
    ctx.fillRect(x - 3, y, 2, 1);
    ctx.fillRect(x + 2, y, 2, 1);
    ctx.fillRect(x, y - 3, 1, 2);
    ctx.fillRect(x, y + 2, 1, 2);

    ctx.restore();
}