'use strict';

export const _if = cond => val => cond ? val : null;
export const pair = (a, b) => a.map((_, i) => [a[i], b[i]]);
export const calcIndex = (i, me, len) => (i - me + len) % len + 1;
