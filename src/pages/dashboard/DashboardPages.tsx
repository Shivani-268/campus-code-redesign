import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Award, CalendarDays, Check, CircleHelp, Clock3, Compass, ExternalLink, FileText, Lightbulb, MessageCircle, Users } from 'lucide-react';
import { challenges } from '../../data';
import { blankPreviewProfile, dashboardReference, type PreviewProfile, type ReferenceEvent } from '../../data/dashboardReference';
import { ChallengeRow } from '../../components';
import { getDemoSession } from '../../services/auth';
import { DashboardLayout } from './DashboardLayout';
import { ActivityList, DashboardPageHeader, EmptyState, EventCard, EventMeta, Eyebrow, PanelHeading, PreviewNote, StatusPill } from './DashboardUI';

const events = dashboardReference.events as readonly ReferenceEvent[];

function WorkspaceOverview() {
  const student = getDemoSession();
  const focus = events.find(event => event.id === 'rebuild-26');
  const openEvent = events.find(event => event.id === 'firstcommit-quiz-26');
  const quickActions = [
    { number: '01', label: 'Find a prompt', detail: 'Explore active challenges', to: '/dashboard/challenges', icon: Compass },
    { number: '02', label: 'Shape a project', detail: 'See your project space', to: '/dashboard/projects', icon: Lightbulb },
    { number: '03', label: 'Meet collaborators', detail: 'Open your team space', to: '/dashboard/teams', icon: Users },
  ];
  return <div className="workspace-page workspace-home">
    <DashboardPageHeader label="STUDENT WORKSPACE / OVERVIEW" title={student?.name ? `Welcome back, ${student.name}.` : 'Welcome to your workspace.'} description="Your place to find the next good question, keep an eye on what?s due, and make progress with other students." action={<span className="workspace-date"><span className="preview-dot"/> LOCAL PREVIEW</span>}/>
    <section className="workspace-home-hero" aria-label="Current focus">
      <div className="home-hero-copy"><Eyebrow>IN FOCUS / 01</Eyebrow><p className="home-hero-intro">A little momentum<br/>goes a long way.</p><span className="home-hero-rule"/><p className="home-hero-note">You have an event on the horizon. Pick up its details or browse what else is happening.</p><Link to="/dashboard/events" className="home-hero-link">Explore the workspace <ArrowUpRight size={16}/></Link></div>
      {focus && <article className="home-focus"><div className="home-focus-top"><Eyebrow>YOUR NEXT DEADLINE</Eyebrow><StatusPill status="REGISTERED"/></div><div className="home-focus-title"><div><span className="home-focus-category">{focus.category}</span><h2>{focus.title}</h2></div><span className="home-focus-date"><strong>08</strong><small>NOV<br/>2026</small></span></div><p>{focus.venue} <span>?</span> {focus.entryType}</p><div className="home-focus-bottom"><span><Check size={14}/> Registration shown as confirmed</span><Link to={`/dashboard/events/${focus.id}`} aria-label={`Open ${focus.title}`}><ArrowUpRight size={18}/></Link></div></article>}
    </section>
    <section className="home-snapshot" aria-label="Reference snapshot totals"><div className="home-snapshot-heading"><Eyebrow>ACTIVITY / REFERENCE SNAPSHOT</Eyebrow><span>Counts transcribed from your supplied dashboard reference</span></div><div className="home-snapshot-values">{dashboardReference.metrics.map((item, i) => <div className="home-snapshot-item" key={item.label}><span>{item.label}</span><strong>{item.value.toString().padStart(2, '0')}</strong><small>{['ALL TIME','IN PROGRESS','ALL TIME','EARNED'][i]}</small></div>)}</div></section>
    <div className="home-work-grid">
      <section className="home-continue"><div className="home-section-heading"><div><Eyebrow>CONTINUE WHERE YOU LEFT OFF</Eyebrow><h2>Keep the thread.</h2></div><Link to="/dashboard/my-events" aria-label="See my events"><ArrowUpRight size={17}/></Link></div>
        {focus && <div className="home-thread"><div className="home-thread-index"><span>01</span><i/></div><div className="home-thread-copy"><span className="home-thread-state"><Check size={13}/> REGISTRATION CONFIRMED / REFERENCE</span><h3>{focus.title}</h3><p>{focus.description}</p><div className="home-thread-foot"><span><Clock3 size={14}/>{focus.deadline}</span><Link to={`/dashboard/events/${focus.id}`}>Review event <ArrowRight size={14}/></Link></div></div></div>}
      </section>
      <section className="home-quick-actions"><div className="home-section-heading"><div><Eyebrow>MAKE YOUR NEXT MOVE</Eyebrow><h2>Where to from here?</h2></div></div><div className="home-action-list">{quickActions.map(({ number, label, detail, to, icon: Icon }) => <Link className="home-action-row" key={number} to={to}><span className="home-action-number">{number}</span><span className="home-action-icon"><Icon size={17}/></span><span className="home-action-copy"><strong>{label}</strong><small>{detail}</small></span><ArrowUpRight size={16}/></Link>)}</div><p className="home-action-note">Project and team actions open workspace previews; those services aren?t connected yet.</p></section>
    </div>
    <div className="home-lower-grid"><section className="home-opportunities"><div className="home-section-heading"><div><Eyebrow>OPEN DOORS / 02 LISTINGS</Eyebrow><h2>Worth a look.</h2></div><Link to="/dashboard/events" className="home-heading-link">All events <ArrowRight size={14}/></Link></div><div className="home-opportunity-list">{[focus, openEvent].filter((event): event is ReferenceEvent => Boolean(event)).map((event, index) => <Link key={event.id} to={`/dashboard/events/${event.id}`} className="home-opportunity"><span className="home-opportunity-index">0{index + 1}</span><span className="home-opportunity-copy"><small>{event.category} <i/> {event.date}</small><strong>{event.title}</strong><span>{event.entryType}</span></span><StatusPill status={dashboardReference.registeredEventIds.some(id => id === event.id) ? 'REGISTERED' : event.status}/><ArrowUpRight size={17}/></Link>)}</div></section>
      <section className="home-activity"><div className="home-section-heading"><div><Eyebrow>RECENT / REFERENCE SNAPSHOT</Eyebrow><h2>Latest activity.</h2></div><Link to="/dashboard/notifications" aria-label="See all activity"><ArrowUpRight size={17}/></Link></div><ActivityList items={dashboardReference.activity}/><p className="home-reference-footnote">Shown from your supplied reference. This is not live account activity.</p></section></div>
    <p className="workspace-data-footnote">Dashboard counts, event details, and activity are transcribed reference data. Your preview sign-in and profile are local to this browser.</p>
  </div>;
}

function MyEventsPage() {
  const registered = events.filter(event => dashboardReference.registeredEventIds.some(id => id === event.id));
  return <div className="workspace-page"><DashboardPageHeader label="YOUR SPACE / EVENTS" title="My events" description="Events marked as registered in the supplied reference snapshot." action={<Link to="/dashboard/events" className="workspace-outline-button">Discover events <ArrowRight size={15}/></Link>}/><PreviewNote>Reference snapshot · One named registration is shown; the aggregate totals include additional records not detailed in the screenshot.</PreviewNote><div className="workspace-list-heading"><span><strong>{registered.length.toString().padStart(2, '0')}</strong> NAMED REGISTRATION{registered.length === 1 ? '' : 'S'}</span><span>UPCOMING FIRST</span></div>{registered.length ? <div className="my-events-list">{registered.map(event => <article className="my-event-row" key={event.id}><div className="my-event-date"><strong>08</strong><span>NOV<br/>2026</span></div><div className="my-event-main"><div><Eyebrow>{event.category}</Eyebrow><StatusPill status="REGISTERED"/></div><h2>{event.title}</h2><p>{event.entryType} · {event.venue}</p><span className="my-event-deadline"><Clock3 size={14}/>{event.deadline}</span></div><Link className="workspace-icon-link" to={`/dashboard/events/${event.id}`} aria-label={`Open ${event.title}`}><ArrowUpRight size={19}/></Link></article>)}</div> : <EmptyState icon={<CalendarDays/>} title="No events on your list yet." description="When you register for an event, it will appear here with its important dates and status." action={<Link className="workspace-primary-button" to="/dashboard/events">Find an event <ArrowRight size={15}/></Link>}/>}</div>;
}

function EventsPage() {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'REGISTERED'>('ALL');
  const visible = events.filter(event => filter === 'ALL' || (filter === 'OPEN' ? event.status === 'OPEN' : dashboardReference.registeredEventIds.some(id => id === event.id)));
  return <div className="workspace-page"><DashboardPageHeader label="OPPORTUNITIES / EVENTS" title="Find your next event." description="Explore the event listings included in the supplied reference snapshot."/><PreviewNote>Event information below is a local reference preview. Registration is not connected in this build.</PreviewNote><div className="workspace-filter-row"><div className="workspace-segmented" role="tablist" aria-label="Filter events">{(['ALL', 'OPEN', 'REGISTERED'] as const).map(option => <button key={option} role="tab" aria-selected={filter === option} className={filter === option ? 'selected' : ''} onClick={() => setFilter(option)}>{option === 'REGISTERED' ? 'MY REGISTRATIONS' : option}</button>)}</div><Eyebrow>{visible.length.toString().padStart(2, '0')} EVENTS</Eyebrow></div>{visible.length ? <div className="workspace-event-grid events-grid">{visible.map(event => <EventCard event={event} key={event.id}/>)}</div> : <EmptyState icon={<CalendarDays/>} title="No events match this view." description="Change the filter or explore challenges while new opportunities are being added." action={<Link to="/dashboard/challenges" className="workspace-inline-link">Browse challenges <ArrowRight size={14}/></Link>}/>}</div>;
}

function EventDetailPage() {
  const { eventId } = useParams();
  const event = events.find(item => item.id === eventId);
  if (!event) return <div className="workspace-page"><DashboardPageHeader label="EVENT / NOT FOUND" title="We couldn't find that event." description="It may not be included in this local reference preview."/><Link className="workspace-primary-button" to="/dashboard/events">Back to events <ArrowRight size={15}/></Link></div>;
  const registered = dashboardReference.registeredEventIds.some(id => id === event.id);
  return <div className="workspace-page"><Link className="workspace-back-link content-back" to={registered ? '/dashboard/my-events' : '/dashboard/events'}>? {registered ? 'MY EVENTS' : 'ALL EVENTS'}</Link><DashboardPageHeader label={`${event.category} / EVENT DETAILS`} title={event.title} description={event.description}/><div className="event-detail-layout"><section className="workspace-panel event-detail-main"><PanelHeading label="EVENT INFORMATION" action={<StatusPill status={registered ? 'REGISTERED' : event.status}/>}/><EventMeta event={event}/><div className="event-detail-copy"><h2>What to know</h2><p>{event.description}</p><p>Event dates, availability, and registration details are shown from the supplied reference snapshot. Check the event organizer's official information before making plans.</p></div>{registered ? <div className="event-confirmed"><Check size={17}/><span><strong>Registration shown as confirmed</strong><small>This is reference preview data; no registration service is connected.</small></span></div> : <div className="event-disabled-action"><button disabled>Registration unavailable in preview</button><span>Registration requires a connected event service.</span></div>}</section><aside className="workspace-panel event-detail-aside"><PanelHeading label="IMPORTANT DATES"/>{event.deadline ? <div className="event-deadline"><span className="deadline-date">08<small>NOV</small></span><span><strong>Submission deadline</strong><small>{event.deadline}</small></span></div> : <EmptyState icon={<CalendarDays/>} title="No deadline listed" description="The supplied reference did not include a deadline for this event."/>}<Link to={registered ? '/dashboard/my-events' : '/dashboard/events'} className="workspace-inline-link">{registered ? 'Back to My events' : 'Browse all events'} <ArrowRight size={14}/></Link></aside></div></div>;
}

function ChallengesPage() {
  const location = useLocation();
  const term = new URLSearchParams(location.search).get('search')?.toLowerCase() ?? '';
  const list = challenges.filter(challenge => `${challenge.title} ${challenge.theme} ${challenge.type}`.toLowerCase().includes(term));
  return <div className="workspace-page"><DashboardPageHeader label="OPPORTUNITIES / CHALLENGES" title="Challenges" description="A challenge is one way into a project. Find a prompt that makes you curious." action={<Link to="/challenges" className="workspace-outline-button">Public challenge page <ExternalLink size={14}/></Link>}/><PreviewNote>Illustrative development seed data · Challenge records are not connected to an event service.</PreviewNote><div className="workspace-list-heading"><span>{list.length.toString().padStart(2, '0')} CHALLENGES</span>{term && <span>SEARCH / {term.toUpperCase()}</span>}</div>{list.length ? <div className="workspace-challenge-list">{list.map(challenge => <ChallengeRow key={challenge.id} item={challenge}/>)}</div> : <EmptyState icon={<Compass/>} title="No challenges found." description="Try another search term or browse all challenges." action={<Link to="/dashboard/challenges" className="workspace-inline-link">Clear search <ArrowRight size={14}/></Link>}/>}</div>;
}

function ProjectsPage() {
  return <div className="workspace-page"><DashboardPageHeader label="YOUR SPACE / PROJECTS" title="Projects" description="A clear view of the work you're part of."/><PreviewNote>Project data is not connected in this frontend preview.</PreviewNote><EmptyState icon={<FileText/>} title="Your project space is ready." description="Project records, progress, contributors, and milestones will appear here when a project service is connected. For now, explore an event or challenge that could become your next build." action={<Link className="workspace-primary-button" to="/dashboard/challenges">Explore challenges <ArrowRight size={15}/></Link>}/><section className="workspace-panel project-next-panel"><PanelHeading label="WHAT WILL APPEAR HERE"/><div className="project-next-grid"><span><b>01</b><strong>Project status</strong><small>Current stage and next milestone</small></span><span><b>02</b><strong>People</strong><small>Teammates and their contributions</small></span><span><b>03</b><strong>Recent activity</strong><small>Updates from your project space</small></span></div></section></div>;
}

function TeamsPage() {
  return <div className="workspace-page"><DashboardPageHeader label="YOUR SPACE / COLLABORATION" title="Teams" description="Find the people building alongside you."/><PreviewNote>Team membership and invitations are not connected in this frontend preview.</PreviewNote><EmptyState icon={<Users/>} title="No team details to show yet." description="Your teams, teammate list, and invitations will appear here when connected account data is available. You can still explore the community and find a challenge to join." action={<Link className="workspace-primary-button" to="/community">Visit the community <ArrowUpRight size={15}/></Link>}/><div className="team-note"><span className="team-note-index">CC / 02</span><p>Good teams start with shared curiosity. The community is open while team tools are being connected.</p><Link to="/dashboard/challenges">Find a shared prompt <ArrowRight size={14}/></Link></div></div>;
}

function ProfilePage() {
  const [profile, setProfile] = useState<PreviewProfile>(() => {
    const session = getDemoSession();
    const storageKey = `campuscode-preview-profile:${session?.email ?? 'guest'}`;
    try { return { ...blankPreviewProfile, name: session?.name ?? '', ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; } catch { return { ...blankPreviewProfile, name: session?.name ?? '' }; }
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setSaved(false); setSaveError(false);
    window.setTimeout(() => { try { localStorage.setItem(`campuscode-preview-profile:${getDemoSession()?.email ?? 'guest'}`, JSON.stringify(profile)); setSaved(true); } catch { setSaveError(true); } finally { setSaving(false); } }, 350);
  };
  const initials = profile.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'S';
  return <div className="workspace-page"><DashboardPageHeader label="YOUR SPACE / IDENTITY" title="Your profile" description="A little context for the people you might build with."/><PreviewNote>Profile edits stay in this browser only; they are not sent to CampusCode.</PreviewNote><div className="profile-layout"><section className="workspace-panel profile-identity"><span className="profile-large-avatar">{initials}</span><Eyebrow>STUDENT PROFILE / PREVIEW</Eyebrow><h2>{profile.name.trim() || 'Your name goes here'}</h2><p>{profile.bio.trim() || 'Add a short intro so collaborators know what you are curious about.'}</p><div className="profile-tags">{profile.interests.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => <span key={tag}>{tag}</span>)}</div><div className="profile-identity-foot"><span>LOCAL PREVIEW PROFILE</span><span>NO ACCOUNT SERVICE CONNECTED</span></div></section><form className="workspace-panel profile-form" onSubmit={onSubmit}><PanelHeading label="ABOUT YOU" action={<span className="local-edit-tag">SAVED IN THIS BROWSER</span>}/><label>Display name<input value={profile.name} onChange={event => setProfile({ ...profile, name: event.target.value })} placeholder="Your name" maxLength={80}/></label><label>Short introduction<textarea value={profile.bio} onChange={event => setProfile({ ...profile, bio: event.target.value })} placeholder="What do you like learning or building?" rows={4} maxLength={260}/></label><label>Interests and skills <span className="field-hint">Separate with commas</span><input value={profile.interests} onChange={event => setProfile({ ...profile, interests: event.target.value })} placeholder="Design, climate, web development" maxLength={180}/></label><div className="profile-save-row"><span role="status">{saveError ? 'Browser storage is unavailable; changes were not saved.' : saved ? 'Saved locally.' : 'You can change this any time.'}</span><button className="workspace-primary-button" disabled={saving}>{saving ? 'Saving…' : 'Save preview profile'} <Check size={15}/></button></div></form></div><section className="workspace-panel participation-panel"><PanelHeading label="PARTICIPATION / REFERENCE SNAPSHOT"/><div className="participation-grid"><span><Award size={17}/><strong>01</strong><small>Certificate count shown in reference</small></span><span><CalendarDays size={17}/><strong>03</strong><small>Registrations shown in reference</small></span><Link to="/dashboard/my-events">View My events <ArrowRight size={14}/></Link></div></section></div>;
}

function NotificationsPage() {
  return <div className="workspace-page"><DashboardPageHeader label="YOUR SPACE / ACTIVITY" title="Activity" description="Updates listed in the supplied dashboard reference."/><PreviewNote>These entries are local reference preview data, not live notifications.</PreviewNote><section className="workspace-panel notifications-panel"><PanelHeading label="RECENT / OCTOBER 2026" action={<span className="subdued-label">02 ITEMS</span>}/><ActivityList items={dashboardReference.activity}/></section><section className="workspace-panel quiet-notifications"><span className="quiet-notifications-mark">?</span><div><Eyebrow>ALL CAUGHT UP</Eyebrow><h2>No other updates in this preview.</h2><p>New notifications will appear here when an account activity source is connected.</p></div></section></div>;
}

function HackMatePage() {
  return <div className="workspace-page"><DashboardPageHeader label="WORKSPACE / HACKMATE AI" title="HackMate AI" description="A dedicated space for AI-assisted hackathon support."/><div className="workspace-panel unavailable-panel"><span className="unavailable-icon"><Lightbulb size={24}/></span><Eyebrow>NOT CONNECTED</Eyebrow><h2>HackMate AI isn't available in this preview.</h2><p>There is no AI service or integration configured in this project. Your workspace will only show this feature as available after a real service is connected.</p><Link to="/dashboard/help" className="workspace-inline-link">Ask about integrations <ArrowRight size={14}/></Link></div></div>;
}

function HelpPage() {
  return <div className="workspace-page"><DashboardPageHeader label="WORKSPACE / SUPPORT" title="Help & support" description="Useful context for this CampusCode preview."/><div className="help-layout"><section className="workspace-panel help-faq"><PanelHeading label="COMMON QUESTIONS"/>{[
    ['Is this connected to my CampusCode account?', 'No. The current project has frontend mock authentication only. Dashboard snapshot values are copied from the supplied reference and are not live account data.'],
    ['Can I register for an event here?', 'No. The event service is not connected. Registration actions are disabled so the preview will not imply a real registration.'],
    ['Where are my projects and teams?', 'The current application has no project or team service. Those pages show honest empty states until a data source exists.'],
  ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</section><aside className="workspace-panel help-contact"><span className="help-contact-icon"><MessageCircle size={20}/></span><Eyebrow>NEED A HAND?</Eyebrow><h2>Tell the CampusCode team what you need.</h2><p>Use the contact page to open a support note. This preview does not send a message automatically.</p><Link to="/contact" className="workspace-inline-link">Open contact page <ArrowUpRight size={14}/></Link></aside></div></div>;
}

function DashboardNotFound() {
  return <div className="workspace-page"><DashboardPageHeader label="WORKSPACE / NOT FOUND" title="That page isn't in this workspace." description="Use the navigation to find your way back."/><Link to="/dashboard" className="workspace-primary-button">Back to overview <ArrowRight size={15}/></Link></div>;
}

function DashboardView() {
  const { pathname } = useLocation();
  if (pathname === '/dashboard') return <WorkspaceOverview/>;
  if (pathname === '/dashboard/my-events') return <MyEventsPage/>;
  if (pathname === '/dashboard/events') return <EventsPage/>;
  if (pathname.startsWith('/dashboard/events/')) return <EventDetailPage/>;
  if (pathname === '/dashboard/challenges') return <ChallengesPage/>;
  if (pathname === '/dashboard/projects') return <ProjectsPage/>;
  if (pathname === '/dashboard/teams') return <TeamsPage/>;
  if (pathname === '/dashboard/profile') return <ProfilePage/>;
  if (pathname === '/dashboard/notifications') return <NotificationsPage/>;
  if (pathname === '/dashboard/hackmate') return <HackMatePage/>;
  if (pathname === '/dashboard/help') return <HelpPage/>;
  return <DashboardNotFound/>;
}

export function DashboardApp() {
  return <DashboardLayout><DashboardView/></DashboardLayout>;
}
