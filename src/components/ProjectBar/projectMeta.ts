export interface ProjectMeta {
  name: string;
  role: string;
  duration: string;
}

export const projectMeta: Record<string, ProjectMeta> = {
  '/rosetta':                    { name: 'ROSETTA',              role: 'DESIGN SYSTEM',      duration: '2024—2025' },
  '/bluebook':                   { name: 'BLUEBOOK',             role: 'DESIGN SYSTEM',      duration: '2023—2024' },
  '/ink':                        { name: 'INK',                  role: 'DESIGN SYSTEM',      duration: '2021—2022' },
  '/vesta':                      { name: 'VESTA',                role: 'DESIGN SYSTEM',      duration: '2022' },
  '/alchemy':                    { name: 'ALCHEMY',              role: 'DESIGN SYSTEM',      duration: '2019—2021' },
  '/ids':                        { name: 'INTUIT DS',            role: 'COMPONENT LIBRARY',  duration: '2017—2019' },
  '/abstract-migrate':           { name: 'ABSTRACT MIGRATE',     role: 'PRODUCT DESIGN',     duration: '2021' },
  '/carta-exercise-status':      { name: 'EXERCISE STATUS',      role: 'PRODUCT DESIGN',     duration: '2022' },
  '/carta-employee-onboarding':  { name: 'EMPLOYEE ONBOARDING',  role: 'PRODUCT DESIGN',     duration: '2022' },
  '/haven':                      { name: 'HAVEN',                role: 'PRODUCT DESIGN',     duration: '2021' },
  '/sapling':                    { name: 'SAPLING',              role: 'PRODUCT DESIGN',     duration: '2021' },
  '/wait-task-v2':               { name: 'WAIT TASK V2',         role: 'PRODUCT DESIGN',     duration: '2023' },
  '/otm':                        { name: 'OTM',                  role: 'PRODUCT DESIGN',     duration: '2019' },
  '/doc-uploader':               { name: 'DOC UPLOADER',         role: 'ENGINEERING',        duration: '2018' },
  '/SR-legacy':                  { name: 'STRAT ROULETTE',       role: 'PRODUCT DESIGN',     duration: '2016' },
  '/SR':                         { name: 'STRAT ROULETTE',       role: 'PRODUCT DESIGN',     duration: '2017' },
  '/product-illustrations':      { name: 'ILLUSTRATIONS',        role: 'BRAND DESIGN',       duration: '2020' },
  '/noho':                       { name: 'NOHO',                 role: 'PRODUCT DESIGN',     duration: '2025' },
  '/brag':                       { name: 'BRAGBOOK',             role: 'PRODUCT DESIGN',     duration: '2024' },
};
