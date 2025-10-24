import type { MapName, Floor } from "../types/index";

export const floors: Partial<Record<MapName, Floor[]>> = {
    bank: ["basement", "ground", "first", "roof"],
    border: ["ground", "first", "roof"],
    chalet: ["basement", "first", "second", "roof"],
    clubhouse: ["basement", "ground", "second", "roof"],
    coastline: ["first", "second", "roof"],
    consulate: ["basement", "ground", "first", "roof"],
    emeraldplains: ["first", "second", "roof"],
    kafe: ["basement", "ground", "first", "roof"],
    kanal: ["ground", "ground2", "first", "second", "roof"],
    lair: ["basement", "first", "second", "roof"],
    nighthavenlabs: ["basement", "first", "second", "roof"],
    oregon: ["basement", "ground", "first", "second", "roof"],
    outback: ["first", "second", "roof"],
    skyscraper: ["first", "second", "roof"],
    themepark: ["first", "second", "roof"],
    villa: ["basement", "first", "second", "roof"],
};
