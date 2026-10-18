// Arte plano propio (DESIGN.md §6). Todo usa tokens semánticos vía CSS vars.
import { useId, useMemo, type CSSProperties } from 'react';

type P = { className?: string; style?: CSSProperties };

/** PRNG determinista: el arte procedural no cambia entre renders ni entre SSR/cliente. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** Torii. Cuerpo en `line` (sumi de día, wakaba de noche), banda en `accent`. */
export function Torii({ className, style, band = true }: P & { band?: boolean }) {
  return (
    <svg viewBox="0 0 1000 900" className={className} style={style} aria-hidden fill="var(--color-line)">
      <path d="M10 70 C 320 128, 680 128, 990 70 L 962 150 C 690 182, 310 182, 38 150 Z" />
      {band && <path d="M38 150 C 310 182, 690 182, 962 150 L 956 168 C 690 198, 310 198, 44 168 Z" fill="var(--color-accent)" />}
      <rect x="92" y="186" width="816" height="40" />
      <rect x="468" y="226" width="64" height="104" />
      <rect x="104" y="330" width="792" height="50" />
      <path d="M196 226 H274 L288 900 H182 Z" />
      <path d="M726 226 H804 L818 900 H712 Z" />
      <rect x="168" y="862" width="134" height="38" fill="var(--color-accent)" />
      <rect x="698" y="862" width="134" height="38" fill="var(--color-accent)" />
    </svg>
  );
}

/** Cordillera en capas. `layer` 0 = lejana (mist), 2 = cercana (line). */
export function Mountains({ className, style, layer = 0, seed = 3 }: P & { layer?: 0 | 1 | 2; seed?: number }) {
  const d = useMemo(() => {
    const r = rng(seed + layer * 97);
    const base = [520, 600, 680][layer];
    const amp = [260, 220, 150][layer];
    const n = [6, 8, 11][layer];
    // picos irregulares con laderas quebradas (estilo grabado plano)
    let path = `M0 900 L0 ${base - amp * 0.2}`;
    const step = 1600 / n;
    for (let i = 0; i < n; i++) {
      const x0 = i * step;
      const px = x0 + step * (0.3 + r() * 0.4);
      const peak = base - amp * (0.35 + r() * 0.65);
      const sx = x0 + (px - x0) * (0.4 + r() * 0.3);
      const sy = base - (base - peak) * (0.35 + r() * 0.3);
      const vx = x0 + step;
      const valley = base - amp * r() * 0.3;
      path += ` L${sx.toFixed(0)} ${sy.toFixed(0)} L${px.toFixed(0)} ${peak.toFixed(0)} L${((px + vx) / 2 + r() * 20).toFixed(0)} ${((peak + valley) / 2 + 20).toFixed(0)} L${vx.toFixed(0)} ${valley.toFixed(0)}`;
    }
    return path + ' L1600 900 Z';
  }, [layer, seed]);
  const fill = ['var(--color-mist)', 'var(--color-surface-raised)', 'var(--color-line)'][layer];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path d={d} fill={fill} />
      {layer === 2 && <path d={d} fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray="2 14" opacity=".5" />}
    </svg>
  );
}

/** Bambú: tallos con nudos y hojas. Para los bordes de pantalla. */
export function Bamboo({ className, style, stalks = 3, seed = 7, flip = false }: P & { stalks?: number; seed?: number; flip?: boolean }) {
  const parts = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: stalks }, (_, s) => {
      const x = 30 + s * (220 / stalks) + r() * 30;
      const w = 18 + r() * 14;
      const nodes = Array.from({ length: 7 }, (_, k) => 60 + k * 140 + r() * 30);
      const leaves = nodes.slice(1, 5).map((y, k) => ({
        y, side: (k + s) % 2 ? 1 : -1, len: 70 + r() * 60, rot: -25 + r() * 50,
      }));
      return { x, w, nodes, leaves };
    });
  }, [stalks, seed]);
  return (
    <svg viewBox="0 0 300 1000" preserveAspectRatio="xMidYMid slice" className={className}
      style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      {parts.map((p, i) => (
        <g key={i} fill="var(--color-line)">
          <rect x={p.x} y="0" width={p.w} height="1000" />
          {p.nodes.map((y) => <rect key={y} x={p.x - 3} y={y} width={p.w + 6} height="7" fill="var(--color-accent)" />)}
          {p.leaves.map((l, k) => (
            <path key={k}
              transform={`translate(${p.x + p.w / 2} ${l.y}) rotate(${l.rot + (l.side < 0 ? 180 : 0)})`}
              d={`M0 0 Q ${l.len * 0.5} -14 ${l.len} 0 Q ${l.len * 0.5} 10 0 0 Z`} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/** Enso de pincel: círculo abierto con borde roto por turbulencia. `draw` 0→1 lo traza. */
export function Enso({ className, style, draw = 1, stroke = 'var(--color-sun)', fill }: P & { draw?: number; stroke?: string; fill?: string }) {
  const id = useId().replace(/:/g, '');
  const C = 2 * Math.PI * 400;
  return (
    <svg viewBox="0 0 1000 1000" className={className} style={style} aria-hidden>
      <defs>
        <filter id={`brush${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="26" />
        </filter>
      </defs>
      {fill && <circle cx="500" cy="500" r="372" fill={fill} />}
      <circle
        cx="500" cy="500" r="400" fill="none" stroke={stroke} strokeWidth="86" strokeLinecap="round"
        strokeDasharray={`${C * 0.9 * draw} ${C}`} transform="rotate(-70 500 500)" filter={`url(#brush${id})`}
      />
    </svg>
  );
}

/** Sello hanko con ロマン vertical. */
export function Hanko({ className, style, size = 72 }: P & { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden>
      <rect x="4" y="4" width="92" height="92" rx="10" fill="var(--color-accent)" />
      <rect x="11" y="11" width="78" height="78" rx="6" fill="none" stroke="var(--color-on-accent)" strokeWidth="3" />
      <text x="50" y="50" fill="var(--color-on-accent)" fontFamily="'Yuji Syuku', serif" fontSize="25"
        textAnchor="middle" dominantBaseline="central" writingMode="vertical-rl" letterSpacing="-2">ロマン</text>
    </svg>
  );
}

/** Rama de tinta fractal (las esquinas de la referencia). */
export function Branch({ className, style, seed = 11, depth = 6 }: P & { seed?: number; depth?: number }) {
  const d = useMemo(() => {
    const r = rng(seed);
    let out = '';
    const grow = (x: number, y: number, a: number, len: number, lvl: number) => {
      if (lvl === 0) return;
      const x2 = x + Math.cos(a) * len;
      const y2 = y + Math.sin(a) * len;
      out += `M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} `;
      const kids = lvl > 3 ? 2 : 1 + Math.round(r());
      for (let k = 0; k < kids; k++) grow(x2, y2, a + (r() - 0.5) * 1.3, len * (0.62 + r() * 0.2), lvl - 1);
    };
    grow(0, 0, 0.75, 120, depth);
    return out;
  }, [seed, depth]);
  return (
    <svg viewBox="-10 -10 520 520" className={className} style={style} aria-hidden>
      <path d={d} stroke="var(--color-line)" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Hojas de bambú cayendo (CSS). Se apagan con reduced-motion desde index.css. */
export function Leaves({ count = 10, seed = 5, className = '' }: { count?: number; seed?: number; className?: string }) {
  const leaves = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => ({
      left: r() * 100, size: 14 + r() * 22, dur: 9 + r() * 10, delay: -r() * 18,
      drift: (r() - 0.3) * 22, spin: 360 + r() * 540,
    }));
  }, [count, seed]);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {leaves.map((l, i) => (
        <svg key={i} viewBox="0 0 40 12" width={l.size * 2.4} height={l.size * 0.7}
          className="absolute top-0"
          style={{
            left: `${l.left}%`,
            animation: `leaf-fall ${l.dur}s linear ${l.delay}s infinite`,
            ['--drift' as string]: `${l.drift}vw`, ['--spin' as string]: `${l.spin}deg`,
          }}>
          <path d="M0 6 Q 20 -2 40 6 Q 20 12 0 6 Z" fill={i % 3 ? 'var(--color-accent)' : 'var(--color-line)'} />
        </svg>
      ))}
    </div>
  );
}

/** Curvas de nivel de una montaña (vista cenital): anillos irregulares concéntricos. */
export function Contours({ className, style, rings = 14, seed = 2 }: P & { rings?: number; seed?: number }) {
  const paths = useMemo(() => {
    const r = rng(seed);
    const harmonics = Array.from({ length: 4 }, (_, k) => ({ a: (r() * 0.12) / (k + 1), f: k + 2, ph: r() * 6.28 }));
    return Array.from({ length: rings }, (_, i) => {
      const R = 40 + i * (460 / rings);
      let d = '';
      for (let s = 0; s <= 96; s++) {
        const t = (s / 96) * Math.PI * 2;
        const k = 1 + harmonics.reduce((acc, h) => acc + h.a * Math.sin(h.f * t + h.ph + i * 0.18), 0);
        const x = 500 + Math.cos(t) * R * k * 1.25;
        const y = 500 + Math.sin(t) * R * k * 0.8;
        d += `${s ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      return d + 'Z';
    });
  }, [rings, seed]);
  return (
    <svg viewBox="0 0 1000 1000" className={className} style={style} aria-hidden fill="none">
      {paths.map((d, i) => (
        <path key={i} d={d} stroke="var(--color-accent)" strokeWidth={i % 4 === 0 ? 3 : 1.4} opacity={0.15 + (i / rings) * 0.45} />
      ))}
    </svg>
  );
}

/** Patrón seigaiha (olas) como fondo. */
export function Seigaiha({ className, style, opacity = 0.08 }: P & { opacity?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} style={style} aria-hidden width="100%" height="100%">
      <defs>
        <pattern id={`sg${id}`} width="80" height="40" patternUnits="userSpaceOnUse">
          {[0, 40, 80].map((x) => [36, 26, 16].map((r) => (
            <circle key={`${x}${r}`} cx={x} cy="40" r={r} fill="none" stroke="var(--color-line)" strokeWidth="3" />
          )))}
          {[36, 26, 16].map((r) => <circle key={r} cx="40" cy="20" r={r} fill="none" stroke="var(--color-line)" strokeWidth="3" />)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#sg${id})`} opacity={opacity} />
    </svg>
  );
}
