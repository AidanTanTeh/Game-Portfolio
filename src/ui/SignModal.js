export class SignModal {
    constructor({ pauseManager }) {
        this.pauseManager = pauseManager;

        this.modal = document.getElementById("tutorial-modal");
        this.closeBtn = document.getElementById("tutorial-close");

        this.wireEvents();
    }

    wireEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener("click", () => this.hide());
        }

        window.addEventListener("keydown", (e) => {
            if (!this.pauseManager.isPaused) return;
            if (e.code === "Escape") this.hide();
        });
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

        this.pauseManager.setPaused(false);
    }
}