export class GameLoop {
    constructor(update, render) {

        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000/60 // 60 frames per second

        this.update = update;
        this.render = render;

        // Request animation id for call back
        this.rafId = null;
        this.isRunning = false;

        
    }

    mainLoop = (timestamp) => {
        if (!this.isRunning) return;
        
        // Calculates how much time passed since the last frame
        let deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // Add that time to the accumulatedTime bucket
        this.accumulatedTime += deltaTime;

        // Fixed time-step updates.
        // Run fixed updates as long as enough time has accumulated
        // This keeps update speed consistent, even if computer is slow
        while (this.accumulatedTime >= this.timeStep) {
            this.update(this.timeStep); // Here, we pass the fixed time step
            this.accumulatedTime -= this.timeStep;
        }

        // Render
        this.render();

        // Request next frame
        this.rafId = requestAnimationFrame(this.mainLoop);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.rafId = requestAnimationFrame(this.mainLoop);
        }
    }

    // Useful for pausing game or bullet-time effect, etc
    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        } 

        this.isRunning = false;
    }
}