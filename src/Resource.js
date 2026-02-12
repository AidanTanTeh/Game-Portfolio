class Resources {
    constructor() {
        // Everything we plan to download
        this.toLoad = {
            hero: "./sprites/hero-sheet.png",
            ground: "./sprites/ground4.png",
            sky: "./sprites/sky.png",
            gunPickup: "./sprites/gunGreyPickup.png",
            gunHeld: "./sprites/gunGreyHeld.png",
            boxSheet: "./sprites/boxsheet2.png",
            bbProjects: "./sprites/snapfit.png",
            bbAbout: "./sprites/me.png",
            bbHobbies: "./sprites/climbing.png",
        }

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