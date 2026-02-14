import { events } from "../Events";

export class PipeModal {
    constructor({ pauseManager }) {
        this.pauseManager = pauseManager;
        this.modal = document.getElementById("pipe-modal");
        this.skipBtn = document.getElementById("pipe-skip");

        if (this.skipBtn) {
            this.skipBtn.addEventListener("click", () => {
                this.hide();
                events.emit("SKIP_GAME");
            });
        }
    }

    show() {
        if (!this.modal) return;

        this.modal.classList.remove("hidden");
        this.modal.setAttribute("aria-hidden", "false");
        this.pauseManager.setPaused(true);
    }

    hide() {
        if (!this.modal) return;
        
        this.modal.classList.add("hidden");
        this.modal.setAttribute("aria-hidden", "true");
    }
}
