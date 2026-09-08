import { useMemo } from 'react';

type Block = { x: number; y: number; z: number; color: string; side: string; dark: string; material: keyof typeof palettes };
const palettes = {
  grass: ['#84b85f', '#52783e', '#355934'], dirt: ['#8f7352', '#66503c', '#483d30'],
  leaf: ['#537e46', '#365c38', '#23432d'], lightLeaf: ['#88ad57', '#5b813e', '#395d30'],
  wood: ['#ac8b52', '#82613d', '#513f2c'], wall: ['#dddbb5', '#a6ae88', '#7a896c'],
  roof: ['#b17c52', '#835635', '#5d3f2b'], glass: ['#ffe9a0', '#efce72', '#d8ac55'],
  path: ['#c5ba83', '#92875a', '#726a49'], water: ['#488c8b', '#306c73', '#234d5b'],
  stone: ['#93988a', '#747c70', '#565f57'], beam: ['#80603e', '#61482f', '#493625'],
  brick: ['#c4785a', '#8f5540', '#6a3e30'],
} as const;
// Steve-style schoolkid built from textured voxel boxes in the same projection as the island blocks.
const kidPalette: Record<string, string> = {
  R: '#d45b48', r: '#a34435', p: '#ee8f7a', H: '#2c1e10', S: '#c8996a', s: '#a67b52', W: '#ffffff', P: '#4e3f8e', N: '#8a5f3c', M: '#6e4230',
  T: '#20a9a9', t: '#178c8c', B: '#3c3d94', b: '#2c2d74', G: '#6c6c6c', g: '#4f4f4f',
};
// Block units and screen px per skin pixel: 16 skin pixels per block, so the kid is two blocks tall and one wide, like in the game.
const K = 1 / 16, U = 23 * K;
const rep = (row: string, n: number) => Array.from({ length: n }, () => row);
const skin = {
  headBack: rep('HHHHHHHH', 8), headTop: rep('HHHHHHHH', 8),
  headSide: ['HHHHHHHH', 'HHHHHHHH', 'HHHSSSSS', 'HSSSSSSS', 'HSSSSSSS', 'SSSSSSSS', 'SSSSSSSS', 'SSSSSSSS'],
  body: ['TTTTTTTt', 'TTTTTTTt', 'TTTTTTTt', 'TTTtTTTt', 'TTTTTTTt', 'TTTTTTTt', 'TTTTTtTt', 'TTTTTTTt', 'TTTTTTTt', 'TtTTTTTt', 'TTTTTTTt', 'tttttttt'],
  bodySide: [...rep('TTTt', 11), 'tttt'],
  arm: [...rep('SSSs', 11), 'ssss'], armTop: rep('SSSS', 4),
  leg: [...rep('BBBb', 10), 'GGGg', 'gggg'], legTop: rep('BBBB', 4),
  capSide: ['RRRRRRRRR', 'RRRRRRRRR', 'rrrrrrrrr'], capTop: ['RRRRRRRRR', 'RppRRRRRR', 'RppRRRRRR', ...rep('RRRRRRRRR', 6)],
  visorTop: rep('rrrrrrrr', 2), visorFront: ['rrrrrrrr'], visorRight: ['rr'],
};
type Tex = { front?: string[]; right?: string[]; top?: string[] };
export default function Island() {
  const blocks = useMemo(() => {
    const result: Block[] = [];
    const add = (x: number, y: number, z: number, material: keyof typeof palettes) => {
      const [color, side, dark] = palettes[material]; result.push({ x, y, z, color, side, dark, material });
    };
    for (let x = 0; x < 12; x++) for (let y = 0; y < 11; y++) {
      if ((x < 2 && y < 2) || (x > 9 && y > 8) || (x === 0 && y > 8) || (x > 10 && y < 2)) continue;
      const height = x > 8 && y < 5 ? 3 : 2;
      for (let z = 0; z <= height; z++) add(x, y, z, z === height ? ((x >= 7 && y >= 6 && y < 9) ? 'water' : (x >= 4 && x <= 6 && y > 5) ? 'path' : 'grass') : 'dirt');
    }
    for (let x = 2; x <= 8; x++) for (let y = 1; y <= 5; y++) for (let z = 3; z <= 8; z++) {
      if (x > 2 && x < 8 && y > 1 && y < 5) continue;
      const window = [4, 5, 7, 8].includes(z) && ((y === 5 && [3, 4, 6, 7].includes(x)) || (x === 8 && [2, 3, 4].includes(y)));
      const door = x === 5 && y === 5 && z < 6;
      const beam = z === 6 || ((x === 2 || x === 8) && (y === 1 || y === 5));
      add(x, y, z, door ? 'wood' : z === 3 ? 'stone' : beam ? 'beam' : window ? 'glass' : 'wall');
    }
    for (let level = 0; level < 4; level++) for (let x = 1; x <= 9; x++) for (let y = level; y <= 6 - level; y++) {
      const dormer = level === 1 && y === 5 && [3, 7].includes(x);
      add(x, y, 9 + level, dormer ? 'glass' : 'roof');
    }
    add(2, 2, 12, 'brick'); add(2, 2, 13, 'brick');
    add(3, 6, 3, 'leaf'); add(3, 6, 4, 'lightLeaf');
    add(7, 6, 3, 'leaf'); add(7, 6, 4, 'lightLeaf');
    const tree = (x: number, y: number, ground: number, light = false) => {
      for (let z = ground + 1; z < ground + 5; z++) add(x, y, z, 'wood');
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let z = ground + 4; z <= ground + 5; z++) add(x + dx * .8, y + dy * .8, z, light ? 'lightLeaf' : 'leaf');
      add(x, y, ground + 6, light ? 'lightLeaf' : 'leaf');
    };
    tree(0, 6, 2); tree(11, 2, 3, true); tree(1, 9, 2, true);
    add(9, 10, 2, 'wood'); add(10, 10, 2, 'wood');
    add(-2, 4, 0, 'grass'); add(-2, 4, -1, 'dirt');
    add(12, 5, 0, 'grass'); add(12, 5, -1, 'dirt');
    add(12, 6, 0, 'grass'); add(12, 6, -1, 'dirt');
    add(4, 12, -1, 'grass'); add(4, 12, -2, 'dirt');
    return result.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z);
  }, []);
  const kid = useMemo(() => {
    const P = (X: number, Y: number, h: number) => [310 + (X - Y) * 23, 258 + (X + Y) * 11.5 - h * 23];
    const paths = (rows: string[]) => {
      const out: Record<string, string> = {};
      rows.forEach((row, y) => {
        for (let x = 0; x < row.length;) {
          const c = row[x]; let w = 1;
          while (row[x + w] === c) w++;
          out[c] = (out[c] ?? '') + `M${x * U} ${y * U}h${w * U}v${U}h-${w * U}z`;
          x += w;
        }
      });
      return Object.entries(out);
    };
    const faces: { transform: string; rows: string[]; shade: number }[] = [];
    const box = (X: number, Y: number, h: number, w: number, d: number, hh: number, tex: Tex) => {
      const top = h + hh * K;
      if (tex.front) { const [x, y] = P(X, Y + d * K, top); faces.push({ transform: `matrix(1 .5 0 1 ${x} ${y})`, rows: tex.front, shade: .16 }); }
      if (tex.right) { const [x, y] = P(X + w * K, Y + d * K, top); faces.push({ transform: `matrix(1 -.5 0 1 ${x} ${y})`, rows: tex.right, shade: .38 }); }
      if (tex.top) { const [x, y] = P(X, Y, top); faces.push({ transform: `matrix(1 .5 -1 .5 ${x} ${y})`, rows: tex.top, shade: 0 }); }
    };
    // Walking away from the viewer towards the door: left leg and right arm swing forward (-Y). Parts are drawn back to front.
    const ground = 3, x0 = 5.5 - 4 * K, y0 = 8 - 2 * K, swing = 1.5 * K;
    box(x0, y0 - swing, ground, 4, 4, 12, { front: skin.leg });
    box(x0 + 4 * K, y0 + swing, ground, 4, 4, 12, { front: skin.leg, right: skin.leg, top: skin.legTop });
    box(x0, y0, ground + 12 * K, 8, 4, 12, { front: skin.body, right: skin.bodySide });
    box(x0, y0 - 4.5 * K, ground + 31 * K, 8, 2, 1, { front: skin.visorFront, right: skin.visorRight, top: skin.visorTop });
    box(x0 - 4 * K, y0 + swing, ground + 12 * K, 4, 4, 12, { front: skin.arm, top: skin.armTop });
    box(x0 + 8 * K, y0 - swing, ground + 12 * K, 4, 4, 12, { front: skin.arm, right: skin.arm, top: skin.armTop });
    box(x0, y0 - 2 * K, ground + 24 * K, 8, 8, 8, { front: skin.headBack, right: skin.headSide, top: skin.headTop });
    box(x0 - .5 * K, y0 - 2.5 * K, ground + 31 * K, 9, 9, 3, { front: skin.capSide, right: skin.capSide, top: skin.capTop });
    return faces.map(f => ({ ...f, paths: paths(f.rows), w: f.rows[0].length * U, h: f.rows.length * U }));
  }, []);
  return <svg className="island" viewBox="190 -50 710 850" role="img" aria-label="Dwupiętrowa szkoła z klocków, zegarem nad wejściem, biało-czerwoną flagą Polski i uczniakiem w czerwonej czapce z daszkiem na unoszącej się wyspie">
    <defs>
      <filter id="shadow"><feGaussianBlur stdDeviation="15" /></filter>
      <pattern id="voxel-grain" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M2 3h6v4H2zM14 14h7v5h-7z" fill="#000" opacity=".1"/><path d="M13 2h8v3h-8zM2 15h4v6H2z" fill="#fff" opacity=".09"/></pattern>
      <pattern id="voxel-stone" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M0 0h23v23H0z" fill="none" stroke="#384435" strokeWidth="1.5"/><path d="M0 11h23M12 0v11M6 11v12" stroke="#354231" opacity=".55"/><path d="M2 2h8v6H2zM14 2h7v6h-7zM8 14h12v6H8z" fill="#fff" opacity=".13"/></pattern>
      <pattern id="voxel-wood" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M0 1h23M0 11h23M0 22h23M8 1v10M17 11v11" stroke="#3e2a19" opacity=".42"/><path d="M2 5h10M13 16h8" stroke="#e5c090" opacity=".2"/></pattern>
      <pattern id="voxel-window" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M1 1h21v21H1zM11.5 1v21M1 11.5h21" fill="none" stroke="#e9ecd0" strokeWidth="1.8"/><path d="m4 8 4-4m6 15 5-5" stroke="#fff9d7" strokeWidth="2" opacity=".75"/></pattern>
      <pattern id="voxel-brick" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M0 0h23v23H0z" fill="none" stroke="#5a2e22" strokeWidth="1.4"/><path d="M0 7.5h23M0 15.5h23M11 0v7.5M6 7.5v8M16 7.5v8M11 15.5v8" stroke="#6e3a2a" opacity=".7"/><path d="M3 2h7v3H3zM14 10h6v3h-6z" fill="#fff" opacity=".12"/></pattern>
    </defs>
    {/* The whole scene is drawn at 23px per block and scaled up here, so the island fills the hero. */}
    <g transform="scale(1.5)">
    <ellipse cx="328" cy="513" rx="207" ry="26" fill="#07150e" opacity=".65" filter="url(#shadow)"/>
    <g className="pixel-stars" fill="#b7c58d"><path d="M148 57h4v4h-4zM209 108h3v3h-3zM399 42h4v4h-4zM571 171h4v4h-4zM141 245h3v3h-3zM520 58h3v3h-3zM581 405h3v3h-3z"/><path d="M160 35h4v-4h4v4h4v4h-4v4h-4v-4h-4Z" opacity=".65"/></g>
    <g className="pixel-moon"><path d="M484 56h30v30h-30Z" fill="#d4d6a0"/><path d="M484 56h10v10h-10zm20 20h10v10h-10z" fill="#b3be88"/></g>
    <g className="cloud cloud-one" fill="#405844" opacity=".4"><path d="M130 158h22v-15h49v15h29v21h-100Z"/><path d="M465 108h22V90h39v18h35v19h-96Z"/></g>
    <g className="island-blocks">{blocks.map((b, i) => {
      const x = 310 + (b.x - b.y) * 23, y = 235 + (b.x + b.y) * 11.5 - b.z * 23;
      const texture = b.material === 'glass' ? 'window' : b.material === 'brick' ? 'brick' : b.material === 'stone' ? 'stone' : ['wood', 'beam', 'roof'].includes(b.material) ? 'wood' : 'grain';
      return <g key={i}><path d={`M${x},${y}l23,11.5 -23,11.5 -23,-11.5Z`} fill={b.color}/><path d={`M${x - 23},${y + 11.5}l23,11.5v23l-23,-11.5Z`} fill={b.side}/><path d={`M${x},${y + 23}l23,-11.5v23l-23,11.5Z`} fill={b.dark}/><rect width="23" height="23" transform={`matrix(1 .5 0 1 ${x - 23} ${y + 11.5})`} fill={`url(#voxel-${texture})`}/><rect width="23" height="23" transform={`matrix(1 -.5 0 1 ${x} ${y + 23})`} fill={`url(#voxel-${texture})`}/>{b.material === 'grass' && <path d={`M${x - 23},${y + 11.5}l23,11.5 23,-11.5v6l-8,4v4l-8,4v-4l-7,3.5 -8,-4v4l-8,-4v-4l-7,-3.5Z`} fill="#729f4c"/>}</g>;
    })}</g>
    <g className="school-clock" transform="matrix(1 .5 0 1 287 200.5)"><path d="M2 2h19v19H2Z" fill="#f3e6b0"/><path d="M2 2h19v19H2Z" fill="none" stroke="#5c4328" strokeWidth="2"/><path d="M10.5 4h2v3h-2zM10.5 16h2v3h-2zM4 10.5h3v2H4zM16 10.5h3v2h-3z" fill="#5c4328"/><path d="M11.5 11.5V6M11.5 11.5h4.5" stroke="#3a3328" strokeWidth="2"/><path d="M10 10h3v3h-3Z" fill="#3a3328"/></g>
    <g className="school-bell" transform="matrix(1 .5 0 1 287 223.5)"><path d="M10 1h3v3h-3Z" fill="#c4922e"/><path d="M7 4h9v9H7Z" fill="#e0b14a"/><path d="M5 13h13v3H5Z" fill="#c4922e"/><path d="M10 16h3v3h-3Z" fill="#d4a33c"/></g>
    <g className="school-door" transform="matrix(1 .5 0 1 287 246.5)"><path d="M0 0h23v69H0Z" fill="#3d291c"/><path d="M2 2h19v67H2Z" fill="#5a3d28"/><path d="M11 2h1v67h-1Z" fill="#3d291c"/><path d="M4 6h5v12H4zM14 6h5v12h-5z" fill="#ffe9a0"/><path d="M4 6h5v12H4zM14 6h5v12h-5z" fill="none" stroke="#3d291c"/><path d="M4 26h5v12H4zM14 26h5v12h-5z" fill="#4a3222"/><path d="M4 46h5v16H4zM14 46h5v16h-5z" fill="#4a3222"/><path d="M7 40h3v3H7zM13 40h3v3h-3z" fill="#e0b14a"/></g>
    <g className="pixel-smoke" fill="#9aa78c" opacity=".45"><path d="M298 -8h6v6h-6zM306 -18h7v7h-7zM292 -26h6v6h-6z"/></g>
    <g className="polish-flag" transform="translate(368 4)"><path d="M0 0v58" stroke="#d0cbb1" strokeWidth="4"/><path d="M2 0h48v15H2Z" fill="#fff"/><path d="M2 15h48v15H2Z" fill="#dc143c"/><path d="M42 0h8v30h-8Z" fill="#000" opacity=".06"/></g>
    <g className="schoolkid" shapeRendering="crispEdges">{kid.map((f, i) => <g key={i} transform={f.transform}>{f.paths.map(([c, d]) => <path key={c} d={d} fill={kidPalette[c]}/>)}{f.shade > 0 && <rect width={f.w} height={f.h} fill="#000" opacity={f.shade}/>}</g>)}</g>
    <g fill="#b4c68d"><path d="M133 329h5v-5h5v5h5v5h-5v5h-5v-5h-5Z"/><path d="M561 303h4v-4h4v4h4v4h-4v4h-4v-4h-4Z"/></g>
    </g>
  </svg>;
}
