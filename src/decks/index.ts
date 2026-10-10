import type { Deck } from '../deck';
import animals from './animals.json';
import moviesTv from './movies-tv.json';
import famousPeople from './famous-people.json';
import foodDrink from './food-drink.json';
import actItOut from './act-it-out.json';
import aroundAustralia from './around-australia.json';
import brandsApps from './brands-apps.json';
import jobsTrades from './jobs-trades.json';
import sporrencesonLocked from './sporrenceson.locked.json';
import type { Sealed } from '../vault-crypto';

export const BUILT_IN_DECKS: Deck[] = [
  animals,
  moviesTv,
  famousPeople,
  foodDrink,
  actItOut,
  aroundAustralia,
  brandsApps,
  jobsTrades,
  {
    id: sporrencesonLocked.id,
    name: sporrencesonLocked.name,
    color: sporrencesonLocked.color,
    icon: sporrencesonLocked.icon,
    description: sporrencesonLocked.description,
    cards: [],
    lockedCount: sporrencesonLocked.count,
  },
] as Deck[];

/** The Crew's cards, encrypted. Opened with a passcode (see vault.ts). */
export const SPORRENCESON_ID = sporrencesonLocked.id;
export const SPORRENCESON_SEALED = sporrencesonLocked.sealed as Sealed;
/** How many digits the keypad waits for (length only, never the code). */
export const SPORRENCESON_CODE_LENGTH: number = (sporrencesonLocked as { codeLength?: number }).codeLength ?? 6;
