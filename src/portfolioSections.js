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
        content: "I created a mobile fitness app which encourages users to stay fit using a post-workout selfie feature (a bit like Strava X beReal)",
        triggerX: gridCells(30),
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbProjects",
    },

    {
        id: "hobbies",
        title: "HOBBIES",
        content: "I love climbing and playing the guitar. Havn't been climbing much lately but I really want to get back into it!",
        triggerX: gridCells(50),
        boxY: FLOOR_Y - 50,
        billboardOffset: { x: -110, y: -80 },
        imageKey: "bbHobbies",
    },

];