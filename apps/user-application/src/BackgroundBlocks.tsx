const blocks = [
  { kind: 'grass', x: '2%', y: 620, size: 62, angle: -8 },
  { kind: 'diamond', x: '95%', y: 850, size: 54, angle: 12 },
  { kind: 'wood', x: '1%', y: 1370, size: 46, angle: 6 },
  { kind: 'stone', x: '96%', y: 1920, size: 63, angle: -10 },
  { kind: 'grass', x: '3%', y: 2470, size: 58, angle: 8 },
  { kind: 'gold', x: '94%', y: 2810, size: 49, angle: -7 },
  { kind: 'diamond', x: '2%', y: 3180, size: 38, angle: 12 },
] as const;
const colors = {
  grass: ['#83ad52', '#806240', '#60482f'],
  diamond: ['#687e79', '#4b615e', '#354c49'],
  wood: ['#aa8656', '#87633e', '#63462d'],
  stone: ['#9a9c8b', '#767e6d', '#576250'],
  gold: ['#777e6a', '#58634f', '#424e3d'],
};

export default function BackgroundBlocks() {
  return <div className="background-blocks" aria-hidden="true">{blocks.map((block, i) => {
    const [top, left, right] = colors[block.kind];
    return <svg key={i} className={`ambient-block ambient-${block.kind}`} viewBox="0 0 64 72" style={{ left: block.x, top: block.y, width: block.size, transform: `rotate(${block.angle}deg)` }}>
      <path d="M32 2 62 17 32 32 2 17Z" fill={top}/>
      <path d="M2 17 32 32v36L2 53Z" fill={left}/>
      <path d="M32 32 62 17v36L32 68Z" fill={right}/>
      {block.kind === 'grass' ? <><path d="m2 17 30 15 30-15v11l-9 4v5l-9 5v-5l-12 6-9-5v5l-9-4v-5L2 28Z" fill="#628d41"/><path d="m10 43 7 4v6l-7-4zm30 10 8-4v6l-8 4z" fill="#b58c55" opacity=".5"/></> : block.kind === 'diamond' || block.kind === 'gold' ? <g fill={block.kind === 'diamond' ? '#7bd8d1' : '#e4c164'}><path d="m8 28 9 5v8l-9-5zm12 22 7 3v8l-7-4zm19-9 8-4v7l-8 4zm12 7 7-4v8l-7 4zM23 12l9-4 7 4-9 5z"/></g> : <g stroke="#2b3626" opacity=".35" fill="none"><path d="m2 29 30 15 30-15M2 41l30 15 30-15M17 25v12m30-12v12M17 49v12m30-12v12"/></g>}
    </svg>;
  })}</div>;
}
