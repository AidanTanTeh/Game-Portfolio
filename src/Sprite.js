import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export class Sprite extends GameObject {
    constructor({
        resource, // image we want to draw
        frameSize, // size of the crop of the image
        hFrames, // how the sprite is arranged horizontally
        vFrames, // how the sprite is arranged vertically
        frame, // which frame we want
        scale, // how large to draw this image
        position, // where to draw it (top left corner)
        animations,
        rotation,
        pivot,
        flipX,
    }) {
        super({});
        this.resource = resource;
        this.frameSize = frameSize ?? new Vector2(16, 16);
        this.hFrames = hFrames ?? 1;
        this.vFrames = vFrames ?? 1;
        this.frame = frame ?? 0;
        this.frameMap = new Map();
        this.scale = scale ?? 1;
        this.position = position ?? new Vector2(0, 0);
        this.animations = animations ?? null
        this.buildFrameMap();
        this.rotation = rotation ?? 0;
        this.pivot = pivot ?? new Vector2(0, 0);
        this.flipX = flipX ?? false;
    }

    buildFrameMap() {
        let frameCount = 0;
        for (let v = 0; v < this.vFrames; v++) {
            for (let h = 0; h < this.hFrames; h++) {
                this.frameMap.set(
                    frameCount,
                    new Vector2(this.frameSize.x * h, this.frameSize.y * v)
                )
                frameCount++;
            }
        }
    }

    step(delta) {
        if (!this.animations) {
            return;
        }
        this.animations.step(delta);
        this.frame = this.animations.frame;
    }


    drawImage(ctx, x, y) {
        if (!this.resource.isLoaded) {
            return;
        }

        // Find the correct sprite sheet frame to use
        let frameCoordX = 0;
        let frameCoordY = 0;
        const frame = this.frameMap.get(this.frame);
        if (frame) {
            frameCoordX = frame.x;
            frameCoordY = frame.y;
        }

        const frameSizeX = this.frameSize.x;
        const frameSizeY = this.frameSize.y;

        if (this.rotation === 0 && !this.flipX) {
            ctx.drawImage (
                this.resource.image,
                frameCoordX,
                frameCoordY, // Top Y corner of frame
                frameSizeX, // How much to crop from the sprite sheet (x)
                frameSizeY, // How much to crop from the sprite sheet (Y)
                x, // Where to place this on cnavas tag X (0)
                y, // Where to place this on canavs tag Y (0)
                frameSizeX * this.scale, // How large to scale it (x)
                frameSizeY * this.scale, // How large to scale it (y)
            )

            return;
        }

        ctx.save();

        const dw = frameSizeX * this.scale;
        const dh = frameSizeY * this.scale;

        const pivotX = this.pivot.x * this.scale;
        const pivotY = this.pivot.y * this.scale;

        // Move origin to pivot point
        ctx.translate(
            Math.round(x + pivotX),
            Math.round(y + pivotY)
        );

        // Rotate around origin
        ctx.rotate(this.rotation);

        // For horizontal mirroring (gun rotation towards left side)
        if (this.flipX) {
            ctx.scale(-1, 1);
        }

        // Draw sprite with pivot in consideration
        ctx.drawImage (
            this.resource.image,
            frameCoordX,
            frameCoordY, 
            frameSizeX, 
            frameSizeY, 
            -pivotX,
            -pivotY, 
            dw,
            dh,
        );

        // DEBUG: draw pivot point
        ctx.fillStyle = "magenta";
        ctx.fillRect(0, 0, 2, 2);

        ctx.restore();
    }
}