// Every client-side route except "/" (which is dist/index.html) and the "*"
// catch-all. The build reads this list to emit a real HTML file per route so
// GitHub Pages can serve deep links directly — see staticRouteShells in
// vite.config.js, which fails the build if this list drifts from App.tsx.
export const ROUTE_PATHS = [
  '/brag',
  '/rosetta',
  '/noho',
  '/bluebook',
  '/ink',
  '/vesta',
  '/alchemy',
  '/ids',
  '/404',
  '/resume',
  '/abstract-migrate',
  '/carta-exercise-status',
  '/carta-employee-onboarding',
  '/haven',
  '/sapling',
  '/wait-task-v2',
  '/otm',
  '/doc-uploader',
  '/SR-legacy',
  '/SR',
  '/product-illustrations',
];
