import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Bell, BriefcaseBusiness, ChevronDown, CircleHelp, Compass, LayoutDashboard, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, Sparkles, UserRound, Users, X, CalendarDays, ArrowUpRight } from 'lucide-react';
import { Mark } from '../../components';
import { challenges } from '../../data';
import { dashboardReference } from '../../data/dashboardReference';
import { clearDemoSession, getDemoSession } from '../../services/auth';

const navigation = [
  { group: 'WORKSPACE', items: [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Events', to: '/dashboard/events', icon: CalendarDays },
    { label: 'Challenges', to: '/dashboard/challenges', icon: Compass },
    { label: 'My events', to: '/dashboard/my-events', icon: Activity },
    { label: 'HackMate AI', to: '/dashboard/hackmate', icon: Sparkles, badge: 'PREVIEW' },
  ] },
  { group: 'YOUR SPACE', items: [
    { label: 'Projects', to: '/dashboard/projects', icon: BriefcaseBusiness },
    { label: 'Teams', to: '/dashboard/teams', icon: Users },
    { label: 'Profile', to: '/dashboard/profile', icon: UserRound },
  ] },
  { group: 'MORE', items: [
    { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
    { label: 'Help & support', to: '/dashboard/help', icon: CircleHelp },
  ] },
];

function currentPage(path: string) {
  if (path === '/dashboard') return 'Overview';
  if (path.startsWith('/dashboard/events/')) return 'Event details';
  const match = navigation.flatMap(group => group.items).find(item => path === item.to || (item.to !== '/dashboard' && path.startsWith(`${item.to}/`)));
  return match?.label ?? (path.startsWith('/dashboard/events/') ? 'Event details' : 'Workspace');
}

function DashboardSearch({ close }: { close: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [
      ...dashboardReference.events.filter(event => `${event.title} ${event.category}`.toLowerCase().includes(q)).map(event => ({ title: event.title, label: 'EVENT', to: `/dashboard/events/${event.id}` })),
      ...challenges.filter(challenge => `${challenge.title} ${challenge.theme}`.toLowerCase().includes(q)).map(challenge => ({ title: challenge.title, label: 'CHALLENGE', to: `/dashboard/challenges?search=${encodeURIComponent(challenge.title)}` })),
    ].slice(0, 5);
  }, [query]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);
  return <div className="workspace-search"><label><Search size={16}/><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search events and challenges" aria-label="Search events and challenges"/><kbd>ESC</kbd></label>{query.trim() && <div className="workspace-search-results">{results.length ? results.map(result => <button key={`${result.label}-${result.title}`} onClick={() => { navigate(result.to); close(); }}><span><small>{result.label}</small>{result.title}</span><ArrowUpRight size={15}/></button>) : <p>No results found in this preview.</p>}</div>}</div>;
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = getDemoSession();
  const accountName = session?.name ?? 'Preview workspace';
  const avatar = accountName.trim().split(/\s+/).map(part => part[0]?.toUpperCase()).slice(0, 2).join('') || 'S';
  const page = currentPage(location.pathname);
  const closeSearch = () => setSearchOpen(false);
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);
  useEffect(() => setSearchOpen(false), [location.pathname]);
  return <div className={`workspace-shell ${collapsed ? 'is-collapsed' : ''}`}>
    {mobileOpen && <button className="workspace-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)}/>}
    <aside className={`workspace-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="workspace-brand-row"><Mark/><button className="workspace-collapse" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <PanelLeftOpen size={16}/> : <PanelLeftClose size={16}/>}</button><button className="workspace-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18}/></button></div>
      <div className="workspace-switcher"><span className="workspace-switcher-icon">C</span><span className="workspace-switcher-copy">CampusCode<small>STUDENT WORKSPACE</small></span><ChevronDown size={14}/></div>
      <nav className="workspace-nav" aria-label="Dashboard navigation">{navigation.map(section => <div className="workspace-nav-group" key={section.group}><span className="workspace-nav-label">{section.group}</span>{section.items.map(item => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `workspace-nav-link ${isActive ? 'active' : ''}`} title={collapsed ? item.label : undefined}><Icon size={17}/><span>{item.label}</span>{item.badge && <small className="nav-preview-badge">{item.badge}</small>}</NavLink>; })}</div>)}</nav>
      <div className="workspace-sidebar-footer"><Link to="/" className="workspace-back-link"><ArrowUpRight size={14}/><span>CampusCode home</span></Link><div className="workspace-account-wrap"><button className="workspace-account-button" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen}><span className="workspace-avatar">{avatar}</span><span className="workspace-account-copy">{accountName}<small>LOCAL PREVIEW ACCOUNT</small></span><ChevronDown size={14}/></button><AnimatePresence>{accountOpen && <motion.div className="workspace-account-menu" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}><Link to="/dashboard/profile" onClick={() => setAccountOpen(false)}><UserRound size={15}/>Profile</Link><button type="button" onClick={() => { clearDemoSession(); setAccountOpen(false); navigate('/login'); }}><LogOut size={15}/>Sign out of preview</button><p>No live session or backend is connected.</p></motion.div>}</AnimatePresence></div></div>
    </aside>
    <div className="workspace-main"><header className="workspace-topbar"><button className="workspace-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open dashboard menu"><Menu size={20}/></button><div className="workspace-breadcrumb"><span>YOUR SPACE</span><b>/</b><strong>{page}</strong></div><div className="workspace-top-actions"><button className={`workspace-search-trigger ${searchOpen ? 'active' : ''}`} onClick={() => setSearchOpen(!searchOpen)} aria-expanded={searchOpen}><Search size={16}/><span>Search</span><kbd>⌘ K</kbd></button><Link to="/dashboard/notifications" className="workspace-icon-button" aria-label="Open activity and notifications"><Bell size={17}/><i/></Link><Link className="workspace-top-avatar" to="/dashboard/profile" aria-label="Open profile">{avatar}</Link></div>{searchOpen && <DashboardSearch close={closeSearch}/>}</header><main className="workspace-content"><AnimatePresence mode="wait"><motion.div key={location.pathname} className="workspace-route" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .22, ease: [.22, 1, .36, 1] }}>{children}</motion.div></AnimatePresence></main></div>
  </div>;
}
