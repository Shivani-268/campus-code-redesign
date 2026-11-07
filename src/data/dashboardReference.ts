/**
 * Local-only reference snapshot transcribed from the dashboard screenshot.
 * This is not connected to an API and must not be presented as live account data.
 */
export type ReferenceEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  status: 'LIVE' | 'OPEN';
  entryType: string;
  description: string;
  venue?: string;
  deadline?: string;
  registration?: 'CONFIRMED';
};

export const dashboardReference = {
  label: 'SUPPLIED REFERENCE / LOCAL PREVIEW',
  metrics: [
    { label: 'Registered', value: 3, note: 'REFERENCE SNAPSHOT' },
    { label: 'Ongoing', value: 1, note: 'REFERENCE SNAPSHOT' },
    { label: 'Completed', value: 2, note: 'REFERENCE SNAPSHOT' },
    { label: 'Certificates', value: 1, note: 'REFERENCE SNAPSHOT' },
  ],
  events: [
    {
      id: 'rebuild-26',
      title: "ReBuild '26",
      category: 'BUILD · LEARN · COLLABORATE',
      date: 'Nov 08, 2026',
      status: 'LIVE' as const,
      entryType: 'Open to all students',
      description: "ReBuild '26 is an individual dashboard-recreation hackathon by CampusCode. Recreate a complete student-facing CampusCode experience, from landing page through event registration. Build, compete, ship.",
      venue: 'Online · CampusCode Arena',
      deadline: 'Submissions close Nov 08',
      registration: 'CONFIRMED' as const,
    },
    {
      id: 'firstcommit-quiz-26',
      title: "FirstCommit '26 Quiz Competition 2.0",
      category: 'KNOWLEDGE · QUIZ',
      date: 'Nov 18, 2026',
      status: 'OPEN' as const,
      entryType: 'Individual entry',
      description: 'A knowledge quiz competition listed in the supplied dashboard reference.',
    },
  ] satisfies ReferenceEvent[],
  registeredEventIds: ['rebuild-26'],
  activity: [
    { id: 'registration-rebuild', text: "You registered for ReBuild '26", date: 'Oct 29', detail: 'REGISTRATION CONFIRMED', tone: 'lime' },
    { id: 'workspace-ready', text: 'Your student workspace is ready', date: 'Oct 28', detail: 'PROFILE CREATED', tone: 'violet' },
  ],
} as const;

/** A blank local profile is the only student profile we can honestly prefill. */
export type PreviewProfile = { name: string; bio: string; interests: string };
export const blankPreviewProfile: PreviewProfile = { name: '', bio: '', interests: '' };
