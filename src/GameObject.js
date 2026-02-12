import { Vector2 } from "./Vector2";
import { events } from "./Events";

export class GameObject {
    constructor ({ position }) {
        this.position = position ?? new Vector2(0, 0);
        this.children = [];
        this.parent = null;

        this.drawLayer = 0; // Larger the number, the more front it is drawn
    }

    // First entry point of the loop
    stepEntry(delta, root) {
        // Call updates on all children first
        this.children.forEach((child) => child.stepEntry(delta, root));

        // Call any implemented Step code
        this.step(delta, root);
    }

    // Called once every frame
    step(delta) {
        // ..
    }

    // Draw entry
    draw(ctx, x, y) {
        const drawPosX = Math.round(x + this.position.x);
        const drawPosY = Math.round(y + this.position.y);

        // Do the actual rendering for Images
        this.drawImage(ctx, drawPosX, drawPosY);

        this.children
            .slice()
            .sort((a, b) => a.drawLayer - b.drawLayer)
            .forEach(child => child.draw(ctx, drawPosX, drawPosY));
    }

    drawImage(ctx, drawPosX, drawPosY) {
        // ..
    }

    destroy() {
        this.children.forEach(child => {
            child.destroy();
        })
        this.parent.removeChild(this);
    }

    addChild(gameObject) {
        gameObject.parent = this;
        this.children.push(gameObject);
    }

    removeChild(gameObject) {
        console.log("gameObject removeChild", gameObject);
        events.unsubscribe(gameObject);
        this.children = this.children.filter(g => {
            return gameObject !== g;
        })
    }

    getWorldPosition() {
        let x = 0;
        let y = 0;
        let current = this;

        while (current) {
            x += current.position.x;
            y += current.position.y;
            current = current.parent;
        }

        return new Vector2(x, y);
    }
}