import { useMemo } from 'react';

type Block = { x: number; y: number; z: number; color: string; side: string; dark: string };
const palettes = {
  grass: ['#84b85f', '#52783e', '#355934'], dirt: ['#8f7352', '#66503c', '#483d30'],
  leaf: ['#537e46', '#365c38', '#23432d'], lightLeaf: ['#88ad57', '#5b813e', '#395d30'],
  wood: ['#ac8b52', '#82613d', '#513f2c'], wall: ['#dddbb5', '#a6ae88', '#7a896c'],
  roof: ['#b17c52', '#835635', '#5d3f2b'], glass: ['#ffe9a0', '#efce72', '#d8ac55'],
  path: ['#c5ba83', '#92875a', '#726a49'], water: ['#488c8b', '#306c73', '#234d5b'],
} as const;
export default function Island() {
  const blocks = useMemo(() => {
    const result: Block[] = [];
    const add = (x: number, y: number, z: number, material: keyof typeof palettes) => {
      const [color, side, dark] = palettes[material]; result.push({ x, y, z, color, side, dark });
    };
    for (let x = 0; x < 12; x++) for (let y = 0; y < 11; y++) {
      if ((x < 2 && y < 2) || (x > 9 && y > 8) || (x === 0 && y > 8) || (x > 10 && y < 2)) continue;
      const height = x > 8 && y < 5 ? 3 : 2;
      for (let z = 0; z <= height; z++) add(x, y, z, z === height ? ((x >= 7 && y >= 6 && y < 9) ? 'water' : (x >= 4 && x <= 6 && y > 5) ? 'path' : 'grass') : 'dirt');
    }
    // A little school, built from individual isometric blocks.
    for (let x = 3; x <= 7; x++) for (let y = 2; y <= 5; y++) for (let z = 3; z <= 6; z++) {
      const window = z === 5 && ((y === 5 && (x === 3 || x === 6)) || (x === 7 && y % 2 === 0));
      const door = x === 5 && y === 5 && z < 5;
      add(x, y, z, door ? 'wood' : window ? 'glass' : 'wall');
    }
    for (let x = 2; x <= 8; x++) for (let y = 1; y <= 6; y++) add(x, y, 7, 'roof');
    for (let x = 3; x <= 7; x++) for (let y = 2; y <= 5; y++) add(x, y, 8, 'roof');
    for (let x = 4; x <= 6; x++) for (let y = 3; y <= 4; y++) add(x, y, 9, 'roof');
    const tree = (x: number, y: number, ground: number, light = false) => {
      for (let z = ground + 1; z < ground + 5; z++) add(x, y, z, 'wood');
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let z = ground + 4; z <= ground + 5; z++) add(x + dx * .8, y + dy * .8, z, light ? 'lightLeaf' : 'leaf');
      add(x, y, ground + 6, light ? 'lightLeaf' : 'leaf');
    };
    tree(1, 4, 2); tree(10, 3, 3, true); tree(2, 8, 2, true);
    add(9, 10, 2, 'wood'); add(10, 10, 2, 'wood');
    // Small detached chunks make the whole scene feel like a floating voxel world.
    add(-2, 4, 0, 'grass'); add(-2, 4, -1, 'dirt');
    add(12, 5, 0, 'grass'); add(12, 5, -1, 'dirt');
    add(12, 6, 0, 'grass'); add(12, 6, -1, 'dirt');
    add(4, 12, -1, 'grass'); add(4, 12, -2, 'dirt');
    return result.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z);
  }, []);
  return <svg className="island" viewBox="0 0 650 560" role="img" aria-label="Izometryczna szkoła z klocków na zielonej wyspie, z drzewami i małym stawem">
    <defs><filter id="shadow"><feGaussianBlur stdDeviation="15" /></filter><linearGradient id="groundFade" x2="0" y2="1"><stop stopColor="#d5d9bb"/><stop offset="1" stopColor="#e9ecd9"/></linearGradient></defs>
    <ellipse cx="328" cy="513" rx="207" ry="26" fill="#07150e" opacity=".65" filter="url(#shadow)"/>
    <g className="pixel-stars" fill="#b7c58d"><path d="M88 77h4v4h-4zM209 108h3v3h-3zM399 42h4v4h-4zM571 171h4v4h-4zM61 245h3v3h-3zM520 58h3v3h-3zM581 405h3v3h-3z"/><path d="M160 35h4v-4h4v4h4v4h-4v4h-4v-4h-4Z" opacity=".65"/></g>
    <g className="pixel-moon"><path d="M484 56h30v30h-30Z" fill="#d4d6a0"/><path d="M484 56h10v10h-10zm20 20h10v10h-10z" fill="#b3be88"/></g>
    <g className="cloud cloud-one" fill="#405844" opacity=".4"><path d="M70 158h22v-15h49v15h29v21H70Z"/><path d="M465 108h22V90h39v18h35v19h-96Z"/></g>
    <g className="island-blocks">{blocks.map((b, i) => {
      const x = 310 + (b.x - b.y) * 23, y = 235 + (b.x + b.y) * 11.5 - b.z * 23;
      return <g key={i}><path d={`M${x},${y}l23,11.5 -23,11.5 -23,-11.5Z`} fill={b.color}/><path d={`M${x - 23},${y + 11.5}l23,11.5v23l-23,-11.5Z`} fill={b.side}/><path d={`M${x},${y + 23}l23,-11.5v23l-23,11.5Z`} fill={b.dark}/></g>;
    })}</g>
    <g transform="translate(310 70)"><path d="M0 0v55" stroke="#745f46" strokeWidth="4"/><path d="M2 0h29v19H2Z" fill="#f0c966"/><path d="M12 4v11M7 9h10" stroke="#fff5d1" strokeWidth="3"/></g>
    <g transform="translate(326 392)"><path d="M0 0v-20h12v20M17 8v-20h12V8" fill="#343f37"/><path d="M-3-21v-22h35v22" fill="#dda85d"/><path d="M4-44v-19h22v19" fill="#e7be92"/><path d="M4-63h22v7H4Z" fill="#715542"/><path d="M-10-40h8v21h-8M32-40h8v21h-8" fill="#e7be92"/></g>
    <g transform="translate(440 205)"><path d="m0 0 20-10 20 10-20 10Z" fill="#bfd38e"/><path d="m0 0 20 10v19L0 19Z" fill="#97b76a"/><path d="m20 10 20-10v19L20 29Z" fill="#6a944d"/></g>
    <g fill="#b4c68d"><path d="M93 329h5v-5h5v5h5v5h-5v5h-5v-5h-5Z"/><path d="M561 303h4v-4h4v4h4v4h-4v4h-4v-4h-4Z"/></g>
  </svg>;
}
