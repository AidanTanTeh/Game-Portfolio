import { gridCells } from "./helpers/grid";
import { Billboard } from "./objects/Billboard/Billboard";
import { FLOOR_Y } from "./world/worldConstants";

export const PORTFOLIO_SECTIONS = [
    {
        id: "about",
        title: "ABOUT ME",
        content: "HI! I'm a UNSW Computer Science student learning how to work with html and css canvases. This is my first wesite, hope you like it!",
        triggerX: gridCells(10), // where the box is in the world
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbAbout",
    },

    {
        id: "projects",
        title: "PROJECTS",
        content: "A mobile fitness app with a real-time GPS tracking system using expo-location and live route visualization along with a post-workout selfie capture and Gemini multimodal AI",
        triggerX: gridCells(30), // where the box is in the world
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbProjects",
    },

    {
        id: "hobbies",
        title: "HOBBIES",
        content: "I love climbing and playing the guitar. Hvan't been climbing much lately but I really want to get back into it!",
        triggerX: gridCells(50), // where the box is in the world
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbHobbies",
    },

];