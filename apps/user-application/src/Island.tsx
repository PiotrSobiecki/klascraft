import { useMemo } from 'react';

type Block = { x: number; y: number; z: number; color: string; side: string; dark: string; material: keyof typeof palettes };
const palettes = {
  grass: ['#84b85f', '#52783e', '#355934'], dirt: ['#8f7352', '#66503c', '#483d30'],
  leaf: ['#537e46', '#365c38', '#23432d'], lightLeaf: ['#88ad57', '#5b813e', '#395d30'],
  wood: ['#ac8b52', '#82613d', '#513f2c'], wall: ['#dddbb5', '#a6ae88', '#7a896c'],
  roof: ['#b17c52', '#835635', '#5d3f2b'], glass: ['#ffe9a0', '#efce72', '#d8ac55'],
  path: ['#c5ba83', '#92875a', '#726a49'], water: ['#488c8b', '#306c73', '#234d5b'],
  stone: ['#93988a', '#747c70', '#565f57'], beam: ['#80603e', '#61482f', '#493625'],
} as const;
// Lower, asymmetric camera: a broad front facade and a narrower right wall.
const camera = { originX: 160, originY: 270, frontX: 30, frontY: 5, sideX: 13, sideY: 9, height: 24 };
const project = (x: number, y: number, z: number) => ({
  x: camera.originX + x * camera.frontX - y * camera.sideX,
  y: camera.originY + x * camera.frontY + y * camera.sideY - z * camera.height,
});
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
    // Two storeys, oak framing, a cobblestone foundation and a stepped roof.
    for (let x = 1; x <= 9; x++) for (let y = 1; y <= 5; y++) for (let z = 3; z <= 8; z++) {
      if (x > 1 && x < 9 && y > 1 && y < 5) continue;
      const window = [4, 5, 7, 8].includes(z) && ((y === 5 && [2, 3, 4, 6, 7, 8].includes(x)) || (x === 9 && [2, 4].includes(y)));
      const door = x === 5 && y === 5 && z < 6;
      const beam = z === 6 || ((x === 1 || x === 9) && (y === 1 || y === 5));
      add(x, y, z, door ? 'wood' : z === 3 ? 'stone' : beam ? 'beam' : window ? 'glass' : 'wall');
    }
    for (let level = 0; level < 4; level++) for (let x = 0; x <= 10; x++) for (let y = level; y <= 6 - level; y++) add(x, y, 9 + level, 'roof');
    // Stone entry steps and oak canopy.
    for (let x = 4; x <= 6; x++) { add(x, 6, 3, 'stone'); add(x, 6, 6, 'roof'); }
    const tree = (x: number, y: number, ground: number, light = false) => {
      for (let z = ground + 1; z < ground + 5; z++) add(x, y, z, 'wood');
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let z = ground + 4; z <= ground + 5; z++) add(x + dx * .8, y + dy * .8, z, light ? 'lightLeaf' : 'leaf');
      add(x, y, ground + 6, light ? 'lightLeaf' : 'leaf');
    };
    tree(0, 6, 2); tree(11, 2, 3, true); tree(1, 9, 2, true);
    add(9, 10, 2, 'wood'); add(10, 10, 2, 'wood');
    // Small detached chunks make the whole scene feel like a floating voxel world.
    add(-2, 4, 0, 'grass'); add(-2, 4, -1, 'dirt');
    add(12, 5, 0, 'grass'); add(12, 5, -1, 'dirt');
    add(12, 6, 0, 'grass'); add(12, 6, -1, 'dirt');
    add(4, 12, -1, 'grass'); add(4, 12, -2, 'dirt');
    return result.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z);
  }, []);
  const flag = project(6, 3, 12);
  const pupil = project(5.1, 7.2, 2);
  return <svg className="island" viewBox="-5 -50 560 550" role="img" aria-label="Powiększona dwupiętrowa szkoła z klocków widziana od frontu z prawej strony, z biało-czerwoną flagą Polski na dachu i kamiennymi schodami">
    <defs>
      <filter id="shadow"><feGaussianBlur stdDeviation="15" /></filter>
      <pattern id="voxel-grain" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M2 3h6v4H2zM14 14h7v5h-7z" fill="#000" opacity=".1"/><path d="M13 2h8v3h-8zM2 15h4v6H2z" fill="#fff" opacity=".09"/></pattern>
      <pattern id="voxel-stone" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M0 0h23v23H0z" fill="none" stroke="#384435" strokeWidth="1.5"/><path d="M0 11h23M12 0v11M6 11v12" stroke="#354231" opacity=".55"/><path d="M2 2h8v6H2zM14 2h7v6h-7zM8 14h12v6H8z" fill="#fff" opacity=".13"/></pattern>
      <pattern id="voxel-wood" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M0 1h23M0 11h23M0 22h23M8 1v10M17 11v11" stroke="#3e2a19" opacity=".42"/><path d="M2 5h10M13 16h8" stroke="#e5c090" opacity=".2"/></pattern>
      <pattern id="voxel-window" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M1 1h21v21H1zM11.5 1v21M1 11.5h21" fill="none" stroke="#e9ecd0" strokeWidth="1.8"/><path d="m4 8 4-4m6 15 5-5" stroke="#fff9d7" strokeWidth="2" opacity=".75"/></pattern>
    </defs>
    <ellipse cx="270" cy="449" rx="218" ry="21" fill="#07150e" opacity=".65" filter="url(#shadow)"/>
    <g className="pixel-stars" fill="#b7c58d"><path d="M88 77h4v4h-4zM209 108h3v3h-3zM399 42h4v4h-4zM571 171h4v4h-4zM61 245h3v3h-3zM520 58h3v3h-3zM581 405h3v3h-3z"/><path d="M160 35h4v-4h4v4h4v4h-4v4h-4v-4h-4Z" opacity=".65"/></g>
    <g className="pixel-moon"><path d="M484 56h30v30h-30Z" fill="#d4d6a0"/><path d="M484 56h10v10h-10zm20 20h10v10h-10z" fill="#b3be88"/></g>
    <g className="cloud cloud-one" fill="#405844" opacity=".4"><path d="M70 158h22v-15h49v15h29v21H70Z"/><path d="M465 108h22V90h39v18h35v19h-96Z"/></g>
    <g className="island-blocks">{blocks.map((b, i) => {
      const { x, y } = project(b.x, b.y, b.z);
      const { frontX: fx, frontY: fy, sideX: sx, sideY: sy, height: h } = camera;
      const texture = b.material === 'glass' ? 'window' : b.material === 'stone' ? 'stone' : ['wood', 'beam', 'roof'].includes(b.material) ? 'wood' : 'grain';
      return <g key={i}>
        <path d={`M${x},${y}l${fx},${fy} -${sx},${sy} -${fx},-${fy}Z`} fill={b.color}/>
        <path d={`M${x - sx},${y + sy}l${fx},${fy}v${h}l-${fx},-${fy}Z`} fill={b.side}/>
        <path d={`M${x + fx - sx},${y + fy + sy}l${sx},-${sy}v${h}l-${sx},${sy}Z`} fill={b.dark}/>
        <g transform={`matrix(${fx / 23} ${fy / 23} 0 ${h / 23} ${x - sx} ${y + sy})`}>
          <rect width="23" height="23" fill={`url(#voxel-${texture})`}/>
          {b.material === 'grass' && <path d="M0 0h23v6h-7v4h-5V6H5v3H0Z" fill="#729f4c"/>}
        </g>
        <g transform={`matrix(${sx / 23} ${-sy / 23} 0 ${h / 23} ${x + fx - sx} ${y + fy + sy})`}>
          <rect width="23" height="23" fill={`url(#voxel-${texture})`}/>
          {b.material === 'grass' && <path d="M0 0h23v7h-6v3h-6V6H0Z" fill="#587e3e"/>}
        </g>
      </g>;
    })}</g>
    <g className="polish-flag" transform={`translate(${flag.x} ${flag.y - 68})`}><path d="M0 0v72" stroke="#d0cbb1" strokeWidth="4"/><path d="M2 0h48v15H2Z" fill="#fff"/><path d="M2 15h48v15H2Z" fill="#dc143c"/><path d="M42 0h8v30h-8Z" fill="#000" opacity=".06"/></g>
    <g transform={`translate(${pupil.x} ${pupil.y + 8}) scale(.8)`}><path d="M0 0v-20h12v20M17 8v-20h12V8" fill="#343f37"/><path d="M-3-21v-22h35v22" fill="#dda85d"/><path d="M4-44v-19h22v19" fill="#e7be92"/><path d="M4-63h22v7H4Z" fill="#715542"/><path d="M-10-40h8v21h-8M32-40h8v21h-8" fill="#e7be92"/></g>
    <g fill="#b4c68d"><path d="M93 329h5v-5h5v5h5v5h-5v5h-5v-5h-5Z"/><path d="M561 303h4v-4h4v4h4v4h-4v4h-4v-4h-4Z"/></g>
  </svg>;
}
