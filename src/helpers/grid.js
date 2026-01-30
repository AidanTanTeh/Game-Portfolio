export const TILE_SIZE = 16;

export const gridCells = n => {
    return n * TILE_SIZE;
}

export const isSpaceFree = (walls, x, y) => {
    // const str = `${x},${y}`;
    // const isWallPresent = walls.has(str);
    
    // return !isWallPresent;
    const snappedX = Math.round(x / 16) * 16;
    const snappedY = Math.round(y / 16) * 16;
    return !walls.has(`${snappedX},${snappedY}`);
}