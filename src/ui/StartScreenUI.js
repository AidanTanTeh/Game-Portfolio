import { events } from "../Events";

export class StartScreenUI {
    constructor({
        rootId = "start-screen",
        startBtnId = "btn-start",
        skipBtnId = "btn-skip",
        secretBtnId = "btn-secret",
        secretScreenId = "secret-screen",
        secretBackId = "secret-back",
        cloudLayerId = "cloud-layer",
        tipId = "daily-tip",
    } = {}) {
        this.root = document.getElementById(rootId);
        this.btnStart = document.getElementById(startBtnId);
        
        this.btnSkip = document.getElementById(skipBtnId);

        this.btnSecret = document.getElementById(secretBtnId);
        this.secretScreen = document.getElementById(secretScreenId);
        this.secretBack = document.getElementById(secretBackId);

        this.cloudLayer = document.getElementById(cloudLayerId);
        this.tipEl = document.getElementById(tipId);

        this.isVisible = true;

        this.tips = [
            "Aidan's Tip: Use desktop to play interactive browser portfolio game, so cool! Wow!",
            "Aidan's Tip: Might not be mobile compatible yet lol sorry",
            "Aidan's Tip: Use desktop for full immersive experience, very wow!!"
        ];

        this.wireEvents();
        this.spawnClouds(8);
        this.setRandomTip();
    }

    wireEvents() {
        // START GAME
        if (this.btnStart) {
            this.btnStart.addEventListener("click", () => {
                events.emit("START_GAME");
            });
        }

        // SKIP GAME
        if (this.btnSkip) {
            this.btnSkip.addEventListener("click", () => {
                console.log("Skip clicked");
                events.emit("SKIP_GAME");
            });
        }

        // SECRET SCREEN
        if (this.btnSecret) {
            this.btnSecret.addEventListener("click", () => {
                this.showSecret();
            });
        }

        // Back button in secret screen
        if (this.secretBack) {
            this.secretBack.addEventListener("click", () => {
                this.hideSecret();
            });
        }
    }

    showSecret() {
        if (!this.secretScreen) return;

        this.secretScreen.classList.remove("hidden");
        this.secretScreen.setAttribute("aria-hidden", "false");
    }

    hideSecret() {
        if (!this.secretScreen) return;

        this.secretScreen.classList.add("hidden");
        this.secretScreen.setAttribute("aria-hidden", "true");
    }

    show() {
        if (!this.root) return;

        this.root.classList.remove("hidden");
        this.isVisible = true;
    }

    hide() {
        if (!this.root) return;

        this.root.classList.add("hidden");
        this.isVisible = false;
    }

    setRandomTip() {
        if (!this.tipEl) return;

        const tip = this.tips[Math.floor(Math.random() * this.tips.length)];
        this.tipEl.textContent = tip;
    }

    spawnClouds(count = 8) {
        if (!this.cloudLayer) return;

        this.cloudLayer.innerHTML = "";

        for (let i = 0; i < count; i++) {
            const cloud = this.makeCloud(i % 3);

            cloud.style.top = `${10 + Math.random() * 60}%`;
            cloud.style.left = `${-200 - Math.random() * 600}px`;

            const scale = 0.5 + Math.random() * 1.4;
            cloud.style.transform = `scale(${scale})`;

            const duration = 20 + Math.random() * 40;
            cloud.style.animationDuration = `${duration}s`;

            const delay = -Math.random() * 40;
            cloud.style.animationDelay = `${delay}s`;

            this.cloudLayer.appendChild(cloud);
        }
    }

    makeCloud(type = 0) {
        const cloud = document.createElement("div");
        cloud.className = "cloud";

        cloud.style.width = "160px";
        cloud.style.height = "60px";
        cloud.style.background = "#ffffff";
        cloud.style.borderRadius = "10px";
        cloud.style.opacity = "0.6";

        const bumps = type === 0
        ? [{ x: 22, y: 10, w: 50, h: 18 }, { x: 70, y: 0, w: 60, h: 22 }]
        : type === 1
        ? [{ x: 12, y: 14, w: 60, h: 18 }, { x: 78, y: 6, w: 50, h: 20 }]
        : [{ x: 28, y: 6, w: 46, h: 18 }, { x: 82, y: 10, w: 56, h: 18 }];

        for (const b of bumps) {
            const d = document.createElement("div");
            d.style.position = "absolute";
            d.style.left = `${b.x}px`;
            d.style.top = `${b.y}px`;
            d.style.width = `${b.w}px`;
            d.style.height = `${b.h}px`;
            d.style.background = "#ffffff";
            d.style.borderRadius = "8px";
            cloud.appendChild(d);
        }

        cloud.style.position = "absolute";
        cloud.style.animationName = "cloudFloat";
        cloud.style.animationTimingFunction = "linear";
        cloud.style.animationIterationCount = "infinite";

        return cloud;
    }
}
