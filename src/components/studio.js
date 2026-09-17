export function initStudio() {
  const button = document.querySelector('#activate-scene');
  if (!button) return () => {};
  const controller = new AbortController();
  let disposed = false;
  let disposeScene;
  const status = document.querySelector('.scene-status');
  button.addEventListener('click', async () => {
    disposeScene?.();
    button.disabled = true; status.textContent = 'Cargando el estudio 3D…';
    try {
      const { initScene } = await import('../scene.js');
      if (disposed) return;
      disposeScene = initScene(document.querySelector('#scene'), (ready) => {
        status.textContent = ready ? 'Estudio 3D listo. Sin movimiento automático.' : 'No se pudo cargar el 3D. La ilustración sigue disponible.';
        button.textContent = ready ? 'ESTUDIO 3D ACTIVO' : 'REINTENTAR 3D ↗';
        button.disabled = ready;
      });
    } catch {
      if (!disposed) { status.textContent = '3D no disponible. La ilustración sigue disponible.'; button.disabled = false; button.textContent = 'REINTENTAR 3D ↗'; }
    }
  }, { signal: controller.signal });
  return () => { disposed = true; controller.abort(); disposeScene?.(); };
}
