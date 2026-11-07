import { useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { syncScrollTriggerLayout } from './lib/scrollTriggerLayout';

const concepts = [
  { index: '01', tag: 'CAMPUS / CONNECTION', title: 'A better campus map.', accent: 'violet', symbol: '↗', description: 'A concept prompt about making campus life easier to navigate.' },
  { index: '02', tag: 'CLIMATE / EVERYDAY', title: 'Small shifts, big impact.', accent: 'lime', symbol: '◌', description: 'A concept prompt about turning everyday choices into climate action.' },
  { index: '03', tag: 'LEARNING / OPEN', title: 'Learning without walls.', accent: 'dark', symbol: '✳', description: 'A concept prompt about sharing knowledge beyond the classroom.' },
];

export function HeroExperience() {
  const [Sculpture, setSculpture] = useState<ComponentType | null>(null);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let active = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { observer.disconnect(); import('./Sculpture').then(module => { if (active) setSculpture(() => module.HeroSculpture); }); }
    }, { rootMargin: '120px' });
    observer.observe(node);
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <div ref={host} className="hero-sculpture" role="img" aria-label="An orbiting network of people, ideas, teams, and projects around a shared starting point">
    <div className="sculpture-index" aria-hidden="true">THE CAMPUSCODE LOOP <span>001</span></div>
    {Sculpture ? <Sculpture /> : <div className="sculpture-placeholder"><span>CC</span></div>}
    <div className="orbit-legend" aria-hidden="true"><span><i className="legend-people"/>PEOPLE</span><span><i className="legend-ideas"/>IDEAS</span><span><i className="legend-teams"/>TEAMS</span><span><i className="legend-projects"/>PROJECTS</span></div>
    <div className="sculpture-orbit-label" aria-hidden="true">A SHARED ORBIT <span>↗</span></div>
  </div>;
}

export function ProjectRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = section.current;
    const rail = track.current;
    if (!root || !rail) return;
    let media: { add: (query: string, callback: () => (() => void) | void) => unknown; revert: () => void } | undefined;
    let active = true;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (!active) return;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add('(min-width: 1024px) and (min-height: 780px) and (prefers-reduced-motion: no-preference)', () => {
        root.classList.add('is-pinned-rail');
        const stopSync = syncScrollTriggerLayout(ScrollTrigger, () => active);
        const context = gsap.context(() => {
          const distance = () => Math.max(0, rail.scrollWidth - root.clientWidth);
          gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: {
            trigger: root, start: 'top top', end: () => `+=${distance() + window.innerHeight * 0.45}`,
            pin: true, pinSpacing: true, anticipatePin: 1, scrub: 0.7, invalidateOnRefresh: true,
          } });
        }, root);
        return () => { stopSync(); context.revert(); root.classList.remove('is-pinned-rail'); };
      });
    });
    return () => { active = false; media?.revert(); root.classList.remove('is-pinned-rail'); };
  }, []);
  return <section className="project-rail-section" ref={section}>
    <div className="project-rail-heading wrap">
      <span className="eyebrow">06 — WORK IN PROGRESS / CONCEPT STUDIES</span>
      <span className="rail-cue">DRAG YOUR CURIOSITY <span>→</span></span>
    </div>
    <div className="project-rail" ref={track}>
      {concepts.map((concept) => <article className={`project-card project-card-${concept.accent}`} key={concept.index}>
        <div className="concept-art"><span className="concept-index">{concept.index} / CC</span><span className="concept-symbol">{concept.symbol}</span><span className="concept-caption">STUDIO PROMPT<br/>NOT A LIVE PROJECT</span></div>
        <div className="concept-copy"><span className="eyebrow">{concept.tag}</span><h3>{concept.title}</h3><p>{concept.description}</p><Link to="/challenges" aria-label={`Explore challenges inspired by ${concept.title}`}>Explore the prompt <ArrowUpRight size={16}/></Link></div>
      </article>)}
    </div>
    <div className="project-rail-foot wrap"><span className="eyebrow">THREE DIRECTIONS. INFINITE WAYS TO BUILD.</span><Link to="/challenges">Explore real challenges <ArrowUpRight size={15}/></Link></div>
  </section>;
}
