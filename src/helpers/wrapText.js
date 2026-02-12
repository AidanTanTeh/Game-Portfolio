export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    // Convert words into array
    const words = (text ?? "").split(" ");

    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY);
            
            // Starts a new line
            line = words[i] + " "; 
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }

    // Draw remaining line at the end
    ctx.fillText(line, x, currentY);
}