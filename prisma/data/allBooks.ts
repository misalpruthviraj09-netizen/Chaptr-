import { BookSeedData } from "./types";
import { group01Books } from "./group01";
import { group02Books } from "./group02";
import { group03Books } from "./group03";
import { group04Books } from "./group04";
import { group05Books } from "./group05";
import { group06Books } from "./group06";
import { group07Books } from "./group07";
import { group08Books } from "./group08";
import { group09Books } from "./group09";
import { group10Books } from "./group10";

export const all100Books: BookSeedData[] = [
  ...group01Books,
  ...group02Books,
  ...group03Books,
  ...group04Books,
  ...group05Books,
  ...group06Books,
  ...group07Books,
  ...group08Books,
  ...group09Books,
  ...group10Books,
];
