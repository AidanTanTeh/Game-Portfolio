import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { Sprite } from "../../Sprite";
import { resources } from "../../Resource";
import { Animations } from "../../Animations";
import { ROTATE_BOX } from "./boxAnimations";
import { DEBUG } from "../../debug";
import { FrameIndexPattern } from "../../FrameIndexPattern";
import { events } from "../../Events";

export class Box extends GameObject {
    constructor(x, y, sectionId) {
        super({
            position: new Vector2(x, y)
        });

        this.w = 15;
        this.h = 15;
        this.scale = 1;

        this.sectionId = sectionId;
        this.isShootable = true;
        this.isDead = false;

        this.drawLayer = 1;

        // Adjust bob speed and amount
        this.bobTime = 0;
        this.bobSpeed = 1;
        this.bobAmount = 2;

        this.sprite = new Sprite({
            resource: resources.images.boxSheet,
            frameSize: new Vector2(this.w, this.h),
            hFrames: 3,
            vFrames: 4,
            frame: 0,
            scale: this.scale,
            position: new Vector2(-(this.w * this.scale) / 2, -(this.h * this.scale) / 2),
            animations: new Animations({
                rotate: new FrameIndexPattern(ROTATE_BOX),
            }),
        });

        this.addChild(this.sprite);

        this.sprite.animations.play("rotate");
    }

    getHitbox() {
        const world = this.getWorldPosition();
        const drawW = this.w * this.scale;
        const drawH = this.h * this.scale;

        return {
            x: world.x - drawW / 2,
            y: world.y - drawH / 2,
            w: drawW,
            h: drawH
        }
    }

    drawImage(ctx, x, y) {
        if (DEBUG) {
            // Hitbox
            const drawW = this.w * this.scale;
            const drawH = this.h * this.scale;

            ctx.strokeStyle = "cyan";
            ctx.strokeRect(
                x - drawW / 2,
                y - drawH / 2,
                drawW,
                drawH
            );

            // anchor dot
            ctx.fillStyle = "magenta";
            ctx.fillRect(x - 1, y - 1, 3, 3);
        }
    }

    step(delta) {
        this.bobTime += delta / 1000;

        // Sine wave between -1 and 1 for bobbing movement
        const offsetY = Math.sin(this.bobTime * Math.PI * 2 * this.bobSpeed) * this.bobAmount;

        // Moving only the sprite, not the box itself
        this.sprite.position.y = -((this.h * this.scale) / 2) + offsetY;
    }

    onBulletHit() {
        if (this.isDead) return;
        this.isDead = true;

        const p = this.getWorldPosition();
        events.emit("BOX_EXPLODE", { x: p.x, y: p.y, sectionId: this.sectionId });

        this.destroy();
    }
}