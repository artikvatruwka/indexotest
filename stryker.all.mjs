import base from './stryker.config.mjs';

export default {
  ...base,
  coverageAnalysis: 'all',
  ignoreStatic: false,
  // Investigation mode: static style/const mutants survive by design here, so no gate.
  thresholds: { break: null },
};
