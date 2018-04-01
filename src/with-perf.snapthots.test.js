import React from 'react';
import test from 'ava';
import snapshot from 'snap-shot';
import withPerf, {
  emojis,
  printTypes,
  styles,
} from './with-perf.js';

test('snapshots', t => {
  snapshot(emojis);
  snapshot(printTypes);
  snapshot(styles);
  t.pass();
});
