export const ROTATE_BOX = {

    duration: 2500,
    frames: [
    // Hold the front (frame 0) longer
    { time: 0,    frame: 0 },
    { time: 600,  frame: 1 },

    // Rotate slower: 100ms per frame
    { time: 700,  frame: 2 },
    { time: 800,  frame: 3 },
    { time: 900,  frame: 4 },
    { time: 1000, frame: 5 },
    { time: 1100, frame: 6 },
    { time: 1200, frame: 7 },
    { time: 1300, frame: 8 },
    { time: 1400, frame: 9 },

    // Returns to front and holds it (so it doesn't pause on frame 9)
    { time: 1500, frame: 0 },
  ],
};