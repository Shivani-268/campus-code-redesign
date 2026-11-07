type ScrollTriggerLike = { refresh: () => void };

/** Re-measure downstream pins when an accordion or other content changes page height. */
export function refreshScrollTriggersAfterLayoutChange(): void {
  void import('gsap').then(async ({ gsap }) => {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
}

/** Refresh pinned layouts after fonts and the first rendered frame have settled. */
export function syncScrollTriggerLayout(
  scrollTrigger: ScrollTriggerLike,
  isActive: () => boolean,
): () => void {
  let frame = 0;
  const refresh = () => {
    if (!isActive()) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (isActive()) scrollTrigger.refresh();
    });
  };

  refresh();
  window.addEventListener('load', refresh, { once: true });
  if ('fonts' in document) void document.fonts.ready.then(refresh);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('load', refresh);
  };
}
