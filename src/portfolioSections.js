import { gridCells } from "./helpers/grid";
import { FLOOR_Y } from "./world/worldConstants";

export const PORTFOLIO_SECTIONS = [
    {
        id: "intro",
        title: "INTRODUCTION",
        content: "HI! My name is Aidan and I'm currently learning how to work with html and css canvases. This is my first website, so pls be nice and I hope you like it!",
        triggerX: gridCells(13), // where the box is in the world
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbIntro",
    },

    {
        id: "about",
        title: "ABOUT ME",
        content: "I'm currently in my second year as a Computer Science student in UNSW! I'm working towards being the best worker McDonald's has ever seen once I graduate, so pls wish me luck!",
        triggerX: gridCells(43),
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbAbout",
    },

    {
        id: "projects",
        title: "RECENT PROJECTS",
        content: "I created a mobile fitness app which encourages users to stay fit using a post-workout selfie feature (a bit like Strava X beReal)",
        triggerX: gridCells(73),
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbProjects",
    },

    {
        id: "hobbies",
        title: "HOBBIES",
        content: "I love climbing and playing the guitar. Havn't been climbing much lately but I really want to get back into it!",
        triggerX: gridCells(103),
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbHobbies",
    },

    {
        id: "games",
        title: "GAMES",
        content: "I also love playing games! Playing games like mario and metal slug growing up is what inspired me to make this game concept!",
        triggerX: gridCells(133),
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbGames",
    },
];