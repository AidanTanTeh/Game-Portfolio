export class PauseManager {
    constructor({ input, mouse, canvas }) {
        this.input = input;
        this.mouse = mouse;
        this.canvas = canvas;

        this._isPaused = false; // Add _ to prevent infinite recursion for getter
    }

    get isPaused() {
        return this._isPaused;
    }

    setPaused(v) {
        this._isPaused = v;

        // Clear one frame inputs
        this.input.clearFrameInputs();
        this.mouse.clearFrameInputs();

        if (v) {
            this.mouse.isDown = false;
            this.mouse.pressed = false;
            this.mouse.released = false;

            this.canvas.style.cursor = "default";
        } else {
            this.canvas.style.cursor = "none";
        }
    }
}
