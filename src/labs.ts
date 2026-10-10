/** Experiments ship after parity acceptance. Their defaults never change a normal round. */
export const LAB_EXPERIMENTS = ['Team mode', 'Round history', 'Skip limit', 'Bonus card', 'Shake to undo', 'Deck mixer', 'Share deck via link', 'Bigger text mode'] as const;
export const LAB_DEFAULTS = Object.freeze({ enabled: false, experiments: Object.fromEntries(LAB_EXPERIMENTS.map(name => [name, false])) });
export function labEnabled(master: boolean, selected: boolean, implemented: boolean): boolean {
  return master && selected && implemented;
}
