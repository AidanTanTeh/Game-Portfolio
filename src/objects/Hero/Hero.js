import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { Sprite } from "../../Sprite";
import { resources } from "../../Resource";
import { Animations } from "../../Animations";
import { FrameIndexPattern } from "../../FrameIndexPattern";
import { WALK_DOWN, WALK_UP, WALK_LEFT, WALK_RIGHT,
         STAND_DOWN, STAND_UP, STAND_LEFT, STAND_RIGHT, 
         PICK_UP_DOWN} from "./heroAnimations";
import { DOWN, LEFT, RIGHT } from "../../Input";
import { isSpaceFree } from "../../helpers/grid";
import { walls } from "../../levels/level1";
import { events } from "../../Events";
import { DEBUG } from "../../debug";
import { FLOOR_Y, WORLD_MAX_X, WORLD_MIN_X } from "../../world/worldConstants";

const GRAVITY = 900;  // px/s^2
const JUMP_VELOCITY = -320; // px/s

export class Hero extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
        });

        this.velocityX = 80;
        this.velocityY = 0;
        this.isGrounded = true;

        this.body = new Sprite({
            resource: resources.images.hero,
            frameSize: new Vector2(32, 32),
            hFrames: 3,
            vFrames: 8,
            frame: 1,
            position: new Vector2(-16, -29),
            animations: new Animations({
                walkDown: new FrameIndexPattern(WALK_DOWN),
                walkUp: new FrameIndexPattern(WALK_UP),
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                standDown: new FrameIndexPattern(STAND_DOWN),
                standUp: new FrameIndexPattern(STAND_UP),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                standRight: new FrameIndexPattern(STAND_RIGHT),
                pickUpDown: new FrameIndexPattern(PICK_UP_DOWN),
            })
        });

        this.addChild(this.body);

        this.handAnchor = new GameObject({
            position: new Vector2(6, -20)
        });
        this.addChild(this.handAnchor);

        this.heldWeapon = null;

        this.facingDirection = DOWN;
        this.itemPickupTime = 0;
        this.itemPickupShell = null;

        events.on("HERO_PICKS_UP_ITEM", this, data => {
            this.onPickUpItem(data);
        })
    }

    step(delta, root) {
        if (this.itemPickupTime > 0) {
            this.workOnItemPickup(delta);
            return;
        }

        const { input } = root;

        // Convert delta to seconds
        const dt = delta / 1000;

        // Horizontal direction intent
        let dx = 0;
        if (input.direction === LEFT) dx = -1;
        else if (input.direction === RIGHT) dx = 1;

        // Jump
        if (input.jumpPressed && this.isGrounded) {
            this.velocityY = JUMP_VELOCITY;
            this.isGrounded = false;
        }

        // Gravity
        this.velocityY += GRAVITY * dt;

        // Animations + facing
        if (!input.direction) {
            if (this.facingDirection === LEFT) this.body.animations.play("standLeft");
            if (this.facingDirection === RIGHT) this.body.animations.play("standRight");
            if (this.facingDirection === DOWN) this.body.animations.play("standDown");
        } else {
            if (input.direction === LEFT) this.body.animations.play("walkLeft");
            if (input.direction === RIGHT) this.body.animations.play("walkRight");
            if (input.direction === DOWN) this.body.animations.play("walkDown");

            this.facingDirection = input.direction; // To stay at direction of last pressed key
        }

        // New position using speed
        let nextX = this.position.x + dx * this.velocityX * dt;
        let nextY = this.position.y + this.velocityY * dt; // speed = vel * time

        // World bounds
        nextX = Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, nextX));

        if (nextY >= FLOOR_Y) {
            nextY = FLOOR_Y;
            this.velocityY = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        // Check if can move
        const canMove = isSpaceFree(walls, nextX, nextY);

        if (canMove) {
            this.position.x = nextX;
            this.position.y = nextY;
        } else {
            this.position.y = nextY;
        }

        this.tryEmitPosition() 
    }

    tryEmitPosition() {
        if (this.lastX === this.position.x && this.lastY === this.position.y) {
            return;
        }
        this.lastX = this.position.x;
        this.lastY = this.position.y;
        events.emit("HERO_POSITION", this.position);
    }

    drawImage(ctx, x, y) {
        // FOR DEBUGGING:
        if (DEBUG) {
            // Hero anchor point (should be at hero's feet)
            ctx.fillStyle = "red";
            ctx.fillRect(x - 1, y - 1, 3, 3);

            // Show where the 32x32 sprite box is drawn
            // body.position is relative to anchor
            const bx = x + this.body.position.x;
            const by = y + this.body.position.y;
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(bx, by, 32, 32);

            // Show bottom of sprite box
            ctx.fillStyle = "orange";
            ctx.fillRect(bx, by + 32, 32, 1);
        }
    }

    onPickUpItem({ type, position }) {
        // Start the pickup animation
        this.itemPickupTime = 800; // ms

        const W = 10;
        const H = 8;

        this.itemPickupShell = new GameObject({});
        this.itemPickupShell.addChild(
            new Sprite({
            resource: resources.images.gunPickup,
            frameSize: new Vector2(W, H),
            position: new Vector2(-3, -25)
        }))

        this.addChild(this.itemPickupShell);
        
        this.itemBeingPickedUp = type;
    }

    workOnItemPickup(delta) {
        this.itemPickupTime -= delta;
        this.body.animations.play("pickUpDown");

        if (this.itemPickupTime <= 0) {
            // Remove pickup shell from the hero
            if (this.itemPickupShell) {
                this.removeChild(this.itemPickupShell);
                this.itemPickupShell = null;
            }

            // Equip the item in the hero's hand
            if (this.itemBeingPickedUp === "gun") {
                this.equipGun();
            }

            this.itemBeingPickedUp = null;
        }
    }

    equipGun() {
        // Remove old weapon if any
        if (this.heldWeapon) {
            this.handAnchor.removeChild(this.heldWeapon);
            this.heldWeapon = null;
        }

        // Held gun sprite resolution
        const W = 8;
        const H = 6;

        const gunSprite = new Sprite({
            resource: resources.images.gunHeld,
            frameSize: new Vector2(W, H),
            position: new Vector2(-8, 13) // Change this to move gun in hand
        });

        this.handAnchor.addChild(gunSprite);
        this.heldWeapon = gunSprite;

        this.hasGun = true;
    }
}