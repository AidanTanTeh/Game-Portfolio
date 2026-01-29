export const LEFT = "LEFT"
export const RIGHT = "RIGHT"
export const UP = "UP"
export const DOWN = "DOWN"

export class Input {
    constructor () {

        this.heldDirections = [];

        document.addEventListener("keydown", (e) => {
            // Check for dedicated direction list
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                this.onArrowPressed(LEFT);
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                this.onArrowPressed(RIGHT);
            }
            // if (e.code === "ArrowUp" || e.code === "KeyW") {
            //     this.onArrowPressed(UP);
            // }
            // if (e.code === "ArrowDown" || e.code === "KeyS") {
            //     this.onArrowPressed(DOWN);
            // }
        })

        document.addEventListener("keyup", (e) => {
            // Check for dedicated direction list
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                this.onArrowReleased(LEFT);
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                this.onArrowReleased(RIGHT);
            }
            // if (e.code === "ArrowUp" || e.code === "KeyW") {
            //     this.onArrowReleased(UP);
            // }
            // if (e.code === "ArrowDown" || e.code === "KeyS") {
            //     this.onArrowReleased(DOWN);
            // }
        })
    }

    get direction() {
        return this.heldDirections[0];
    }

    onArrowPressed(direction) {
        // Add this arrow to the start of the list if it's new
        if (this.heldDirections.indexOf(direction) === -1) {
            this.heldDirections.unshift(direction);
        }
    }

    onArrowReleased(direction) {
        const index = this.heldDirections.indexOf(direction);
        if (index === -1) {
            return;
        }

        // Remove this key from the list
        this.heldDirections.splice(index, 1);
    }
}