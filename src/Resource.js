class Resources {
    constructor() {
        // Everything we plan to download
        const BASE = import.meta.env.BASE_URL; // -> "/Game-Portfolio/" on Pages

        this.toLoad = {
            hero: `${BASE}sprites/hero-sheet.png`,
            ground: `${BASE}sprites/ground4.png`,
            sky: `${BASE}sprites/sky.png`,
            gunPickup: `${BASE}sprites/gunGreyPickup.png`,
            gunHeld: `${BASE}sprites/gunGreyHeld.png`,
            boxSheet: `${BASE}sprites/boxsheet2.png`,

            bbIntro: `${BASE}sprites/me.png`,
            bbAbout: `${BASE}sprites/mcd.png`,
            bbProjects: `${BASE}sprites/snapfit.png`,
            bbHobbies: `${BASE}sprites/climbing.png`,
            bbGames: `${BASE}sprites/gamerSeal.png`,
        };

        // Bucket to keep all images
        this.images = {};

        // Load each image
        Object.keys(this.toLoad).forEach(key => {
            const img = new Image();
            img.src = this.toLoad[key];
            this.images[key] = {
                image: img,
                isLoaded: false
            }
            img.onload = () => {
                this.images[key].isLoaded = true;
            }
        })
    };
}

// Create one instance for the whole app to use
export const resources = new Resources();