import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, CircleHelp, Clock3, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReferenceEvent } from '../../data/dashboardReference';

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

export function DashboardPageHeader({ label, title, description, action }: { label: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="workspace-page-header"><div><Eyebrow>{label}</Eyebrow><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="workspace-page-action">{action}</div>}</header>;
}

export function PanelHeading({ label, action }: { label: string; action?: ReactNode }) {
  return <div className="workspace-panel-heading"><Eyebrow>{label}</Eyebrow>{action}</div>;
}

export function PreviewNote({ children = 'Local reference preview · Not connected to live account data' }: { children?: ReactNode }) {
  return <div className="workspace-preview-note"><span className="preview-dot"/>{children}</div>;
}

export function StatusPill({ status }: { status: string }) {
  const tone = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`workspace-status status-${tone}`}><i/>{status}</span>;
}

export function EventCard({ event, compact = false }: { event: ReferenceEvent; compact?: boolean }) {
  return <article className={`workspace-event-card ${compact ? 'compact' : ''}`}>
    <div className="workspace-event-top"><Eyebrow>{event.category}</Eyebrow><StatusPill status={event.status}/></div>
    <h3>{event.title}</h3>
    <div className="workspace-event-meta"><span><CalendarDays size={14}/>{event.date}</span><span><Users size={14}/>{event.entryType}</span></div>
    {event.registration && <span className="registration-tag">✓ {event.registration}</span>}
    <Link to={`/dashboard/events/${event.id}`} className="workspace-card-link">{compact ? 'View event' : 'Event details'} <ArrowUpRight size={15}/></Link>
  </article>;
}

export function EmptyState({ icon = '◌', title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="workspace-empty"><span className="workspace-empty-icon">{icon}</span><div><h3>{title}</h3><p>{description}</p>{action}</div></div>;
}

export function ActivityList({ items }: { items: readonly { id: string; text: string; date: string; detail: string; tone: string }[] }) {
  return <div className="workspace-activity-list">{items.map(item => <div className="workspace-activity" key={item.id}><span className={`activity-mark ${item.tone}`}/><p>{item.text}</p><span className="activity-date">{item.date}</span><Eyebrow>{item.detail}</Eyebrow></div>)}</div>;
}

export function EventMeta({ event }: { event: ReferenceEvent }) {
  return <div className="workspace-event-meta detail-meta"><span><CalendarDays size={15}/>{event.date}</span>{event.venue && <span><CircleHelp size={15}/>{event.venue}</span>}{event.deadline && <span><Clock3 size={15}/>{event.deadline}</span>}<span><Users size={15}/>{event.entryType}</span></div>;
}

export function SearchEmpty({ query, clear }: { query: string; clear: () => void }) {
  return <div className="workspace-search-empty"><Search size={19}/><span>No dashboard results for “{query}”.</span><button onClick={clear}>Clear search <ArrowRight size={13}/></button></div>;
}
