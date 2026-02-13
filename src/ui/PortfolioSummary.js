import { PORTFOLIO_SECTIONS } from "../portfolioSections";

export class PortfolioSummary {
    constructor() {
        this.byId = new Map(PORTFOLIO_SECTIONS.map((s) => [s.id, s]));

        // Grab DOM nodes
        this.introP = document.getElementById("p-intro-text");
        this.aboutP = document.getElementById("p-about-text");
        this.hobbiesP = document.getElementById("p-hobbies-text");
        this.gamesP = document.getElementById("p-games-text");

        this.projectsGrid = document.getElementById("projects-grid");

        this.render();
        this.wireNav();
        this.wireContactForm();
    }

    render() {
        // INTRO
        const intro = this.byId.get("intro");
        if (intro && this.introP) this.introP.textContent = intro.content;

        // ABOUT
        const about = this.byId.get("about");
        if (about && this.aboutP) this.aboutP.textContent = about.content;

        // HOBBIES
        const hobbies = this.byId.get("hobbies");
        if (hobbies && this.hobbiesP) this.hobbiesP.textContent = hobbies.content;

        // PROJECTS
        const projects = this.byId.get("projects");
        if (projects && this.projectsGrid) {
            this.projectsGrid.innerHTML = "";

            const card = document.createElement("article");
            card.className = "pixel-box";
            card.innerHTML = `
                <h3 class="pixel-h3">${projects.title}</h3>
                <p class="pixel-text">${projects.content}</p>
            `;
            this.projectsGrid.appendChild(card);
        }

        // GAMES
        const games = this.byId.get("games");
        if (games && this.gamesP) this.gamesP.textContent = games.content;
    }

    wireNav() {
        // any button with data-jump scrolls to an element
        document.querySelectorAll("[data-jump]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const sel = btn.getAttribute("data-jump");
                document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
            });
        });
    }

    wireContactForm() {
        const form = document.getElementById("contact-form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Havn't actually implemented this yet lol (Coming soon!)");
            form.reset();
        });
    }
}   