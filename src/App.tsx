import { World, Station } from '@/world/World';
import { STATIONS, type StationId } from '@/world/stations';
import { useLang } from '@/i18n/LangContext';
import { GateScene } from '@/scenes/Gate';
import { PathScene } from '@/scenes/Path';
import { DojoScene } from '@/scenes/Dojo';
import { ProjectGroupScene } from '@/scenes/ToriiTunnel';
import { ForestScene } from '@/scenes/Forest';
import { ShrineScene } from '@/scenes/Shrine';
import { FlatStory } from '@/scenes/FlatStory';
import { Backdrop } from '@/components/Backdrop';
import { Chrome } from '@/components/Chrome';
import { Loader } from '@/components/Loader';
import { CaseScroll } from '@/components/CaseScroll';

// ?motion=off fuerza la versión sin animaciones (enlace en el footer)
const reduced =
  matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('motion') === 'off';

function scene(id: StationId) {
  switch (id) {
    case 'mon': return <GateScene />;
    case 'michi': return <PathScene />;
    case 'waza': return <DojoScene />;
    case 'sistemas': return <ProjectGroupScene path="system" />;
    case 'webs': return <ProjectGroupScene path="web" />;
    case 'mori': return <ForestScene />;
    case 'en': return <ShrineScene />;
  }
}

export default function App() {
  const { t } = useLang();
  if (reduced) return <><FlatStory /><CaseScroll /></>;
  return (
    <>
      <a href="#main" className="label-mono sr-only z-90 bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        {t.meta.skip}
      </a>
      <a href="?motion=off" className="label-mono sr-only z-90 bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        {t.en.flat}
      </a>
      <World background={<Backdrop />} overlay={<Chrome />}>
        {STATIONS.map((s, i) => <Station key={s.id} index={i}>{scene(s.id)}</Station>)}
      </World>
      <CaseScroll />
      <Loader />
    </>
  );
}
