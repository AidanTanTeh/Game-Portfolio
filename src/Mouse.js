import { Vector2 } from "./Vector2";

export class Mouse {
    constructor(canvas) {
        this.canvas = canvas;

        // Where mouse is on the canvas
        this.screen = new Vector2(0, 0);

        // Where mouse is in the game world (depends on camera)
        this.world = new Vector2(0, 0);

        this.isDown = false;
        this.pressed = false;
        this.released = false;

        canvas.addEventListener("mousemove", (e) => this.onMove(e));
        canvas.addEventListener("mousedown", () => {
            this.isDown = true;
            this.pressed = true;
        });
        canvas.addEventListener("mouseup", () => {
            this.isDown = false;
            this.released = true;
        });
    }

    onMove(e) {
        // Convert browser pixels to canvas pixels
        const rect = this.canvas.getBoundingClientRect();

        // Scale canvas in case its bigger than 320x180
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        // clientX/Y are mouse coords on the page
        this.screen.x = (e.clientX - rect.left) * scaleX;
        this.screen.y = (e.clientY - rect.top) * scaleY;
    }

    updateWorld(camera) {
        // Converts screen coords into world coords
        this.world.x = this.screen.x - camera.position.x;
        this.world.y = this.screen.y - camera.position.y;
    }

    clearFrameInputs() {
        this.pressed = false;
        this.released = false;
    }
}