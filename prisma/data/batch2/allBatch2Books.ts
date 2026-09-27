import { BookSeedData } from "../types";
import { batch2Group01Books } from "./group01";
import { batch2Group02Books } from "./group02";
import { batch2Group03Books } from "./group03";
import { batch2Group04Books } from "./group04";
import { batch2Group05Books } from "./group05";
import { batch2Group06Books } from "./group06";
import { batch2Group07Books } from "./group07";
import { batch2Group08Books } from "./group08";
import { batch2Group09Books } from "./group09";
import { batch2Group10Books } from "./group10";

export const all100Batch2Books: BookSeedData[] = [
  ...batch2Group01Books,
  ...batch2Group02Books,
  ...batch2Group03Books,
  ...batch2Group04Books,
  ...batch2Group05Books,
  ...batch2Group06Books,
  ...batch2Group07Books,
  ...batch2Group08Books,
  ...batch2Group09Books,
  ...batch2Group10Books,
];
