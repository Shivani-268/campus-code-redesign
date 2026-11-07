import { useEffect, useRef, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, Compass, Lightbulb, Users, Layers3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChallengeRow, MagneticLink, Reveal } from './components';
import { challenges } from './data';
import { HeroExperience, ProjectRail } from './HeroVisual';
import { refreshScrollTriggersAfterLayoutChange, syncScrollTriggerLayout } from './lib/scrollTriggerLayout';

const stages = [
  { name: 'PEOPLE', accent: 'lime', label: 'Find your people.', body: 'Meet students who are curious about the same things you are. Different skills, shared energy, no perfect pitch required.', action: 'See where the community gathers', icon: Users },
  { name: 'IDEAS', accent: 'violet', label: 'Give an idea a direction.', body: 'Follow a question, join a challenge, or borrow a little momentum from something already in motion.', action: 'Explore the open challenges', icon: Lightbulb },
  { name: 'PROJECTS', accent: 'paper', label: 'Make a first version real.', body: 'Build in the open, learn as you go, and give a useful idea somewhere to grow.', action: 'Find a place to start', icon: Layers3 },
];

function LetterLine({ text, className = '' }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  return <span className={`hero-word-line ${className}`} aria-hidden="true">{Array.from(text).map((letter, index) => <motion.span key={index} className="hero-letter" initial={reduced ? false : { y: '120%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : .72, delay: reduced ? 0 : .16 + index * .012, ease: [.22, 1, .36, 1] }}>{letter === ' ' ? '\u00a0' : letter}</motion.span>)}</span>;
}

function Hero() {
  return <section className="new-hero wrap" aria-labelledby="home-title">
    <div className="new-hero-top"><span className="eyebrow"><i className="live-dot"/> A PLACE TO MAKE YOUR NEXT THING</span><span className="eyebrow">CAMPUSCODE / 2.0</span></div>
    <div className="new-hero-stage">
      <h1 id="home-title" className="new-hero-title" aria-label="Your next project starts here."><span className="sr-only">Your next project starts here.</span><LetterLine text="YOUR NEXT"/><LetterLine text="PROJECT" className="hero-outline"/><LetterLine text="STARTS HERE." className="hero-lime"/></h1>
      <HeroExperience />
    </div>
    <div className="new-hero-bottom"><p>You don’t need a polished plan or a team already waiting. Bring a question. Find your people. Make a first version.</p><div className="new-hero-actions"><MagneticLink to="/challenges" className="button button-dark">Explore challenges <ArrowUpRight size={16}/></MagneticLink><Link to="/community" className="underlined-link">Find your people <ArrowRight size={16}/></Link></div><a href="#ecosystem-story" className="scroll-cue" aria-label="Scroll to discover the CampusCode ecosystem"><span>SCROLL TO FIND YOUR THREAD</span><ArrowDown size={17}/></a></div>
  </section>;
}

function EcosystemArt({ stage }: { stage: number }) {
  return <div className={`ecosystem-art art-stage-${stage}`} aria-hidden="true">
    <div className="art-coordinate eyebrow">CC / ECOSYSTEM STUDY <span>0{stage + 1}</span></div>
    <AnimatePresence mode="wait">
      {stage === 0 && <motion.div key="people" className="people-map" initial={{ opacity: 0, scale: .92, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.04, rotate: 5 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
        <svg className="map-lines" viewBox="0 0 520 420" fill="none"><path d="M95 238 186 96 326 122 421 244 297 344 150 326 95 238Z"/><path d="m186 96 111 248M326 122 150 326M95 238l231-116M421 244 186 96"/></svg>
        <span className="person-node pn-one">S</span><span className="person-node pn-two">?</span><span className="person-node pn-three">✳</span><span className="person-node pn-four">+</span><span className="person-node pn-five">↗</span>
        <span className="map-caption caption-one">YOUR CURIOSITY</span><span className="map-caption caption-two">SOMEONE ELSE’S SKILL</span><span className="map-caption caption-three">A SHARED START</span>
      </motion.div>}
      {stage === 1 && <motion.div key="ideas" className="idea-field" initial={{ opacity: 0, y: 20, rotate: 5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -18, rotate: -5 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
        <span className="idea-ring ring-a"/><span className="idea-ring ring-b"/><span className="idea-burst">?</span><span className="idea-note note-a">WHAT IF<br/>WE TRIED?</span><span className="idea-note note-b">ROUGH DRAFT<br/>001</span><span className="idea-line"/><span className="idea-cursor">↗</span>
      </motion.div>}
      {stage === 2 && <motion.div key="projects" className="project-stack" initial={{ opacity: 0, y: 26, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -18, rotate: -4 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
        <span className="stack-sheet sheet-back"><i/><i/><i/></span><span className="stack-sheet sheet-mid"><i/><i/></span><span className="stack-sheet sheet-front"><b>VERSION 0.1</b><strong>MADE<br/>TO LEARN.</strong><i/></span><span className="stack-stamp">IN<br/>MOTION</span>
      </motion.div>}
    </AnimatePresence>
    <span className="art-coordinate art-coord-bottom eyebrow">A SHARED SPACE TO MAKE THINGS HAPPEN <span>↗</span></span>
  </div>;
}

function EcosystemStory() {
  const [stage, setStage] = useState(0);
  const current = useRef(0);
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = root.current;
    if (!node || reduced) return;
    let media: { add: (query: string, callback: () => (() => void) | void) => unknown; revert: () => void } | undefined;
    let active = true;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (!active) return;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add('(min-width: 1024px) and (min-height: 780px) and (prefers-reduced-motion: no-preference)', () => {
        const stopSync = syncScrollTriggerLayout(ScrollTrigger, () => active);
        const trigger = ScrollTrigger.create({ trigger: node, start: 'top top', end: '+=1650', pin: true, pinSpacing: true, anticipatePin: 1, scrub: .65, onUpdate: self => {
          const next = Math.min(2, Math.floor(self.progress * 3));
          if (next !== current.current) { current.current = next; setStage(next); }
        } });
        return () => { stopSync(); trigger.kill(); };
      });
    });
    return () => { active = false; media?.revert(); };
  }, [reduced]);
  const stageAction = stages[stage];
  const Icon = stageAction.icon;
  const change = (index: number) => { current.current = index; setStage(index); };
  return <section className="ecosystem-story" id="ecosystem-story" ref={root} aria-labelledby="ecosystem-heading">
    <div className="wrap ecosystem-story-inner">
      <div className="story-top"><span className="eyebrow">01 / THE CAMPUSCODE LOOP</span><span className="eyebrow">NOT A DIRECTORY. A WAY INTO MAKING.</span></div>
      <div className="story-grid">
        <div className="story-copy">
          <p className="eyebrow">EVERYTHING STARTS SOMEWHERE</p>
          <h2 id="ecosystem-heading">Curiosity<br/>finds a way<span className="lime-period">.</span></h2>
          <div className="stage-tabs" role="tablist" aria-label="CampusCode ecosystem stages">{stages.map((item, index) => <button key={item.name} className={index === stage ? 'active' : ''} role="tab" aria-selected={index === stage} onClick={() => change(index)}><span>0{index + 1}</span>{item.name}<ArrowUpRight size={14}/></button>)}</div>
          <AnimatePresence mode="wait"><motion.div className="stage-description" key={stage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}><div className="stage-title"><Icon size={18}/><h3>{stageAction.label}</h3></div><p>{stageAction.body}</p></motion.div></AnimatePresence>
          <Link className="story-action" to={stage === 0 ? '/community' : stage === 1 ? '/challenges' : '/guides'}>{stageAction.action}<ArrowRight size={16}/></Link>
        </div>
        <EcosystemArt stage={stage}/>
      </div>
      <div className="story-progress" aria-hidden="true"><span style={{ width: `${(stage + 1) / 3 * 100}%` }}/></div>
    </div>
  </section>;
}

function Welcome() {
  const [selected, setSelected] = useState(0);
  const notes = [
    { key: 'I HAVE A QUESTION', line: 'A challenge can give your curiosity a useful direction.', action: 'Browse challenges', to: '/challenges' },
    { key: 'I WANT A TEAM', line: 'Meet people who want to explore the same idea from another angle.', action: 'Meet collaborators', to: '/community' },
    { key: 'I CAN LEND A HAND', line: 'Find work in progress and bring a skill you want to use.', action: 'Explore the project space', to: '/projects' },
  ];
  return <section className="welcome-section wrap" aria-labelledby="welcome-heading">
    <div className="welcome-intro"><span className="eyebrow">02 / A GOOD PLACE TO BEGIN</span><h2 id="welcome-heading">What are you<br/>curious about<span className="violet-period">?</span></h2><p>No complete plan needed. Bring a question, an interest, or a skill you would like to put to use. We will help you find a next step.</p><span className="welcome-footnote">NO POLISHED PITCH REQUIRED <i>?</i></span></div>
    <div className="welcome-workbench"><div className="workbench-top"><span className="eyebrow">START FROM WHERE YOU ARE</span><span className="eyebrow">0{selected + 1} / 03</span></div><div className="welcome-options" role="tablist" aria-label="Choose a starting point">{notes.map((note, index) => <button role="tab" aria-selected={selected === index} className={selected === index ? 'selected' : ''} onClick={() => setSelected(index)} key={note.key}><span>0{index + 1}</span>{note.key}<ArrowUpRight size={15}/></button>)}</div><div className="welcome-next" aria-live="polite"><span className="eyebrow">A POSSIBLE NEXT STEP</span><AnimatePresence mode="wait" initial={false}><motion.p key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .24 }}>{notes[selected].line}</motion.p></AnimatePresence><Link to={notes[selected].to}>{notes[selected].action}<ArrowRight size={15}/></Link></div></div>
  </section>;
}
function EntryPoints() {
  const [active, setActive] = useState<number | null>(null);
  const paths = [
    { title: 'I have an idea.', detail: 'Give it a first shape with a challenge, a tiny prototype, or a conversation.', to: '/challenges', cta: 'Find a prompt', color: 'entry-violet', glyph: '↗' },
    { title: 'I want a team.', detail: 'Find collaborators who care about the same question and bring a different skill.', to: '/community', cta: 'Meet collaborators', color: 'entry-lime', glyph: '◎' },
    { title: 'I can help build.', detail: 'Join something already moving and bring your perspective to the work.', to: '/projects', cta: 'Explore the project space', color: 'entry-paper', glyph: '＋' },
    { title: 'I’m just looking.', detail: 'See what people are exploring. Follow the thread that makes you curious.', to: '/challenges', cta: 'See what’s happening', color: 'entry-dark', glyph: '⌁' },
  ];
  return <section className="entry-section" aria-labelledby="entry-heading"><div className="wrap"><div className="section-head"><span className="eyebrow">03 / PICK YOUR WAY IN</span><span className="eyebrow">NO WRONG FIRST MOVE</span></div><div className="entry-intro"><h2 id="entry-heading">Where do you<br/>want to begin<span className="violet-period">?</span></h2><p>There’s more than one door into a good project. Choose the one that sounds like you today.</p></div><div className="entry-list">{paths.map((path, index) => <div className={`entry-row ${path.color} ${active === index ? 'is-open' : ''}`} key={path.title}><button aria-expanded={active === index} onClick={() => setActive(active === index ? null : index)}><span className="entry-number">0{index + 1}</span><span className="entry-title">{path.title}</span><span className="entry-glyph">{path.glyph}</span></button><AnimatePresence initial={false}>{active === index && <motion.div className="entry-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35, ease: [.22, 1, .36, 1] }} onAnimationComplete={refreshScrollTriggersAfterLayoutChange}><p>{path.detail}</p><Link to={path.to}>{path.cta}<ArrowUpRight size={15}/></Link></motion.div>}</AnimatePresence></div>)}</div></div></section>;
}

function CommunityBand() {
  const [line, setLine] = useState(0);
  const [Visual, setVisual] = useState<ComponentType | null>(null);
  const visualHost = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const lines = ['wondering about it, too.', 'looking for a team, too.', 'ready to share a first draft, too.'];
  useEffect(() => {
    const node = visualHost.current;
    if (!node) return;
    let active = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        import('./Sculpture').then(module => { if (active) setVisual(() => module.CollaborationOrbit); });
      }
    }, { rootMargin: '100px' });
    observer.observe(node);
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <section className="community-band new-community" aria-labelledby="community-home-heading"><div className="wrap new-community-inner"><div className="community-meta"><span className="eyebrow">04 / YOUR PEOPLE ARE OUT THERE</span><span className="eyebrow">A PLACE FOR THE IN-PROGRESS</span></div><div className="community-composition"><div className="community-message"><p className="eyebrow">YOU DON’T NEED A PERFECT INTRODUCTION</p><h2 id="community-home-heading">Your people<br/>are out there<span className="lime-period">.</span></h2><p className="community-support">Somewhere, someone is</p><div className="community-changing-line" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.span key={line} initial={reduced ? false : { y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: '-110%', opacity: 0 }} transition={{ duration: reduced ? 0 : .36, ease: [.22, 1, .36, 1] }}>{lines[line]}</motion.span></AnimatePresence><button onClick={() => setLine((line + 1) % lines.length)} aria-label="Show another way your people might be looking">↗</button></div><Link className="button button-lime" to="/community">Meet your people <ArrowUpRight size={16}/></Link></div><div className="community-visual" ref={visualHost}><div className="community-visual-frame">{Visual ? <Visual/> : <div className="community-visual-placeholder"><span>PEOPLE</span><span>IDEAS</span><span>TOGETHER</span></div>}<span className="collab-label collab-one">SHARED<br/>QUESTION</span><span className="collab-label collab-two">DIFFERENT<br/>PERSPECTIVES</span><span className="collab-label collab-three">A FIRST<br/>DRAFT</span><span className="collab-caption eyebrow">A LITTLE CLOSER, ALREADY.</span></div></div></div></div></section>;
}

function FinalArtifact() {
  const reduced = useReducedMotion();
  return <Link to="/challenges" className="final-artifact" aria-label="Find an open challenge to turn a question into a first draft" onPointerMove={event => {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - .5) * 10}deg`);
    event.currentTarget.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - .5) * -8}deg`);
  }} onPointerLeave={event => { event.currentTarget.style.setProperty('--tilt-x', '0deg'); event.currentTarget.style.setProperty('--tilt-y', '0deg'); }}>
    <span className="artifact-orbit"/><span className="artifact-paper paper-back">A QUESTION<br/><b>WHAT IF?</b></span><span className="artifact-paper paper-front"><small>FIRST DRAFT / 001</small><strong>MAKE<br/>A START.</strong><i/></span><span className="artifact-sticker">OPEN<br/>CALL ↗</span><span className="artifact-instruction">FOLLOW THE QUESTION</span>
  </Link>;
}

export function Home() {
  return <><Hero/><EcosystemStory/><Welcome/><section className="challenge-section home-challenges"><div className="wrap"><div className="section-head"><span className="eyebrow">03 / OPEN CALLS</span><span className="eyebrow">DEVELOPMENT SEED / 2026</span></div><div className="challenge-title"><h2>Try something<br/>you haven’t tried<span className="violet-period">.</span></h2><Link className="text-link" to="/challenges">All challenges <ArrowUpRight/></Link></div><div className="challenge-list">{challenges.slice(0, 3).map(item => <ChallengeRow key={item.id} item={item}/>)}</div><div className="challenge-foot"><span className="eyebrow">A PROMPT CAN BE A FIRST STEP</span><Link className="button button-violet" to="/challenges">Browse the open calls <ArrowRight/></Link></div></div></section><EntryPoints/><CommunityBand/><ProjectRail/><section className="final-cta new-final-cta"><div className="wrap final-cta-grid"><div className="final-cta-copy"><span className="eyebrow">05 / SEE WHAT YOUR QUESTION BECOMES</span><h2>Put the question<br/>to work<span className="lime-period">.</span></h2><p>Take the thought you keep coming back to and give it a first draft, a teammate, a place to go.</p><MagneticLink to="/challenges">Find your first prompt <ArrowUpRight size={16}/></MagneticLink><span className="cta-index eyebrow">CAMPUSCODE / OPEN BY DESIGN</span></div><FinalArtifact/></div></section></>;
}

export function AboutPage() {
  return <div className="editorial-page about-page"><section className="editorial-hero wrap"><span className="eyebrow">A SMALL HISTORY OF STARTING</span><h1>We made room<br/>for the <span>in-between.</span></h1><p>Between "I have an idea" and "I built the thing." Between the skills you have and the people you have not met yet.</p></section><section className="about-manifesto"><div className="wrap about-manifesto-grid"><span className="eyebrow">WHY CAMPUSCODE EXISTS</span><div><h2>Ideas move when people can work on them <em>together.</em></h2><p>CampusCode brings students with shared interests together around open challenges, early ideas, and projects in progress. Find people, choose a next step, and learn by making something with others.</p><div className="about-story-steps"><span>01 / FIND A QUESTION</span><span>02 / MEET YOUR PEOPLE</span><span>03 / MAKE A FIRST VERSION</span></div><Link to="/challenges" className="underlined-link">See what you could start <ArrowUpRight size={15}/></Link></div></div></section><section className="about-difference wrap"><div className="about-stamp eyebrow">NOT A<br/>FINISHED<br/>PRODUCT<br/><span>- A PLACE<br/>TO MAKE ONE</span></div><div><span className="eyebrow">WHAT MAKES THIS DIFFERENT</span><h2>Built around<br/>the work between<br/>the idea and<br/>the outcome<span className="violet-period">.</span></h2><div className="about-values"><p><b>Start with a question.</b> No application to belong, no polished pitch to prepare.</p><p><b>Build in company.</b> Find collaborators who add their perspective and energy.</p><p><b>Learn by shipping.</b> A small real thing teaches more than a perfect plan.</p></div></div></section></div>;
}
export function CommunityPage() {
  const [selected, setSelected] = useState(0);
  const moods = [
    ['Still figuring it out?', 'That is a completely good place to begin. Bring the question, even if you don’t have the answer yet.'],
    ['Already making something?', 'Let people in. Share the rough version, find a fresh perspective, and keep moving together.'],
    ['Looking for your crew?', 'Your teammate might be a designer who codes, a builder who writes, or someone asking the same question.'],
  ];
  return <div className="community-page"><section className="community-page-hero"><div className="wrap"><span className="eyebrow">THE PEOPLE ARE THE POINT</span><div className="community-page-grid"><h1>You don’t<br/>have to make<br/>it <span>alone.</span></h1><div className="community-page-aside"><p>A community for curious students who want to make useful, interesting, slightly unfinished things together.</p><div className="community-prompt-tabs">{moods.map((item, index) => <button onClick={() => setSelected(index)} className={selected === index ? 'active' : ''} key={item[0]}>{item[0]}<ArrowUpRight size={14}/></button>)}</div><AnimatePresence mode="wait"><motion.p className="community-changing-copy" key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{moods[selected][1]}</motion.p></AnimatePresence><Link to="/register" className="button button-lime">Find your way in <ArrowUpRight size={15}/></Link></div></div><div className="community-page-bottom"><span>OPEN TO THE IN PROGRESS</span><span>PEOPLE MAKE THE POSSIBILITY.</span><Sparkles size={18}/></div></div></section><section className="wrap community-values"><span className="eyebrow">A COMMUNITY IS A VERB</span><div><p>Share what you’re learning.</p><p>Make room for another perspective.</p><p>Celebrate the first version.</p></div></section></div>;
}

export function GuidesPage() {
  const [active, setActive] = useState(0);
  const paths = [
    { icon: Lightbulb, label: 'I have an idea', line: 'Start with a challenge or a question you can’t stop turning over.', cta: 'Explore challenges', to: '/challenges' },
    { icon: Users, label: 'I’m looking for a team', line: 'Find collaborators who care about the same problem from a different angle.', cta: 'Meet the community', to: '/community' },
    { icon: Layers3, label: 'I want to contribute', line: 'Look for the work already in motion and bring something useful to it.', cta: 'Browse project space', to: '/projects' },
    { icon: Compass, label: 'I’m just exploring', line: 'Follow what catches your attention. Curiosity is a good enough reason.', cta: 'See what’s happening', to: '/challenges' },
  ];
  const ActiveIcon = paths[active].icon;
  return <div className="guides-page wrap"><div className="guides-heading"><span className="eyebrow">FIELD GUIDE / YOUR FIRST MOVE</span><h1>There’s a way<br/>in for you<span className="violet-period">.</span></h1><p>You don’t have to know the whole route. Pick the door that feels closest to where you are.</p></div><div className="guides-explorer"><div className="guides-menu" role="tablist" aria-label="Choose a starting point">{paths.map((path, index) => <button key={path.label} role="tab" aria-selected={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><span>0{index + 1}</span>{path.label}<ArrowUpRight size={15}/></button>)}</div><AnimatePresence mode="wait"><motion.article className="guide-invitation" key={active} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .3 }}><span className="guide-icon"><ActiveIcon size={24}/></span><span className="eyebrow">A STARTING POINT / 0{active + 1}</span><h2>{paths[active].label}<span className="violet-period">.</span></h2><p>{paths[active].line}</p><Link to={paths[active].to} className="button button-dark">{paths[active].cta} <ArrowRight size={16}/></Link><span className="guide-annotation eyebrow">NO PERFECT FIRST STEP REQUIRED</span></motion.article></AnimatePresence></div></div>;
}
