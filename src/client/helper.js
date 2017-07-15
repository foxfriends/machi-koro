'use strict';

export const _if = cond => val => cond ? val : null;
export const pair = (a, b) => a.map((_, i) => [a[i], b[i]]);
