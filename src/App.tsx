import { World, Station } from '@/world/World';
import { STATIONS, type StationId } from '@/world/stations';
import { useLang } from '@/i18n/LangContext';
import { SenalScene } from '@/scenes/Senal';
import { QuienScene } from '@/scenes/Quien';
import { GuiaScene } from '@/scenes/Guia';
import { ProjectGroupScene } from '@/scenes/Canales';
import { AjusteScene } from '@/scenes/Ajuste';
import { ContactoScene } from '@/scenes/Contacto';
import { FlatStory } from '@/scenes/FlatStory';
import { Backdrop } from '@/components/Backdrop';
import { Chrome } from '@/components/Chrome';
import { Loader } from '@/components/Loader';
import { CaseScroll } from '@/components/CaseScroll';

// prefers-reduced-motion o ?motion=off (enlace en el footer): lo decide el script de index.html
const reduced = 'flat' in document.documentElement.dataset;

function scene(id: StationId) {
  switch (id) {
    case 'senal': return <SenalScene />;
    case 'quien': return <QuienScene />;
    case 'guia': return <GuiaScene />;
    case 'sistemas': return <ProjectGroupScene path="system" />;
    case 'webs': return <ProjectGroupScene path="web" />;
    case 'ajuste': return <AjusteScene />;
    case 'contacto': return <ContactoScene />;
  }
}

export default function App() {
  const { t } = useLang();
  if (reduced) return <><FlatStory /><CaseScroll /></>;
  return (
    <>
      <a href="#main" className="label-px sr-only z-90 bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        {t.meta.skip}
      </a>
      <a href="?motion=off" className="label-px sr-only z-90 bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        {t.contacto.flat}
      </a>
      <World background={<Backdrop />} overlay={<Chrome />}>
        {STATIONS.map((s, i) => <Station key={s.id} index={i}>{scene(s.id)}</Station>)}
      </World>
      <CaseScroll />
      <Loader />
    </>
  );
}
