import { GameObject } from "../../GameObject";
import { Sprite } from "../../Sprite";
import { Vector2 } from "../../Vector2";
import { resources } from "../../Resource";
import { events } from "../../Events";
import { DEBUG } from "../../debug";

const W = 10;
const H = 8;

export class Gun extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
        });

        const sprite = new Sprite({
            resource: resources.images.gunPickup,
            frameSize: new Vector2(W, H),
            position: new Vector2(-W / 2, -H),
        });
        this.addChild(sprite);

        events.on("HERO_POSITION", this, pos => {
            // Detect overlap
            const roundedHeroX = Math.round(pos.x);
            const roundedHeroY = Math.round(pos.y);
            if (roundedHeroX === this.position.x && roundedHeroY === this.position.y) {
                console.log("OVERLAP!");
                this.onCollideWithHero();
            }
        })
    }

    onCollideWithHero() {
        // Remove this instance from the scene
        this.destroy();
        
        // Alert other things that we picked up a rod
        events.emit("HERO_PICKS_UP_ITEM", {
            type: "gun",
            position: this.position
        });
    }

    drawImage(ctx, x, y) {
        if (DEBUG) {
            ctx.strokeStyle = "cyan";
            ctx.strokeRect(x - W / 2, y - H, W, H);
        }
    }

}