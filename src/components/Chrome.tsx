// Lo que vive fuera de las estaciones: la TV (marco + controles) y el salto de los casos que no existen.
import { useEffect } from 'react';
import { useWorld } from '@/world/World';
import { STATIONS } from '@/world/stations';
import { missingCase } from '@/scenes/Contacto';
import { TvFrame } from './TvFrame';

export function Chrome() {
  const { cut } = useWorld();

  // un caso que no existe (#/p/<id>) lleva al canal 404
  useEffect(() => {
    const check = () => { if (missingCase()) cut(STATIONS.findIndex((s) => s.id === 'contacto')); };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [cut]);

  return <TvFrame />;
}
