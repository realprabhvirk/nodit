// Unlock state for The Crew. The passcode is remembered on this device so you
// only enter it once; "Lock again" forgets it.
import { signal } from '@preact/signals';
import type { Card } from './deck';
import { SPORRENCESON_ID, SPORRENCESON_SEALED } from './decks';
import { load, remove, save } from './storage';
import { open } from './vault-crypto';
import { log } from './debug';

export const sporrencesonCards = signal<Card[] | null>(null);

export async function unlockCrew(code: string): Promise<boolean> {
  try {
    const json = await open(SPORRENCESON_SEALED, code);
    if (json == null) return false;
    sporrencesonCards.value = JSON.parse(json) as Card[];
    save('sporrencesonCode', code);
    return true;
  } catch {
    return false;
  }
}

export function lockCrew(): void {
  sporrencesonCards.value = null;
  remove('sporrencesonCode');
  // The saved deal order holds card names in plain text; drop it too.
  remove('queue:' + SPORRENCESON_ID);
  log('crew: locked');
}

const saved = load<string | null>('sporrencesonCode', null);
if (saved)
  void unlockCrew(saved).then((ok) => {
    log(`crew: remembered code ${ok ? 'opened it' : 'failed'}`);
    if (!ok) remove('sporrencesonCode');
  });
