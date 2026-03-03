import type { Challenge } from "../types";
import { booleanNamingChallenges } from "./boolean-naming";
import { callbackNamingChallenges } from "./callback-naming";
import { childrenPatternChallenges } from "./children-pattern";
import { defaultValuesChallenges } from "./default-values";
import { discriminatedUnionsChallenges } from "./discriminated-unions";
import { extendingHtmlChallenges } from "./extending-html";
import { jsdocChallenges } from "./jsdoc";
import { propSpecificityChallenges } from "./prop-specificity";
import { renderPropsChallenges } from "./render-props";

/**
 * All challenges for the game, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * (e.g. `callback-naming.ts`) and append your challenge to its array.
 * Difficulty sorting and side randomization happen automatically in the game hook.
 */
export const challenges: Challenge[] = [
  ...callbackNamingChallenges,
  ...booleanNamingChallenges,
  ...jsdocChallenges,
  ...propSpecificityChallenges,
  ...renderPropsChallenges,
  ...childrenPatternChallenges,
  ...discriminatedUnionsChallenges,
  ...extendingHtmlChallenges,
  ...defaultValuesChallenges,
];
