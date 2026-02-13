import { gridCells } from "../helpers/grid";

export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 180;

export const LEVEL_WIDTH = 2500;

export const WORLD_MIN_X = 0;
export const WORLD_MAX_X = LEVEL_WIDTH;

// World y where hero feet anchor should be
export const FLOOR_Y = gridCells(10);