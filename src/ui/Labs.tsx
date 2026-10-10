import { signal, effect } from '@preact/signals';
import { load, save } from '../storage';
import { LAB_EXPERIMENTS } from '../labs';
import { Group, Row, Switch } from './controls';
const enabled = signal(load<boolean>('labs', false));
effect(() => save('labs', enabled.value));
export function Labs() {
  return <Group label="Labs" foot="Experiments are coming after the first release. The game plays as usual.">
    <Row title="Enable Labs" trail={<Switch label="Enable Labs" checked={enabled.value} onChange={value => { enabled.value = value; }} />} />
    {enabled.value && LAB_EXPERIMENTS.map(name => <Row key={name} title={name} sub="Coming later" trail={<input type="checkbox" role="switch" class="switch" aria-label={name} disabled checked={false} />} />)}
  </Group>;
}
