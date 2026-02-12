import { PORTFOLIO_SECTIONS } from "../portfolioSections";

export function getSectionById(id) {
    return PORTFOLIO_SECTIONS.find((s) => s.id === id);
}