// Provisional lab timings (seconds), damage and movement. Not product balance.
export const FRAME = 0.1;
export const RULES = { minX: 48, maxX: 912, speed: 150, range: 105, damage: 10, dummyHp: 100 };
export const actions = {
  idle: { frames: 2 }, walk: { frames: 4 },
  slash: { frames: 6, hit: 2 }, thrust: { frames: 5, hit: 2 },
  dash: { frames: 4 }, dashSlash: { frames: 6, hit: 3 },
  stagger: { frames: 3 }, knockback: { frames: 3 }, fallen: { frames: 4 }, getUp: { frames: 4 },
} as const;
export type Action = keyof typeof actions;
export const labels: Record<Action, string> = { idle: '대기', walk: '걷기', slash: '베기', thrust: '찌르기', dash: '대쉬', dashSlash: '돌진 베기', stagger: '경직', knockback: '넉백', fallen: '넘어짐', getUp: '기상' };
