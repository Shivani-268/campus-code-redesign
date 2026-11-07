export type AuthResult = { ok: boolean; message: string };
export type DemoSession = { email: string; name: string };
const SESSION_KEY = 'campuscode-demo-session';
let volatileSession: DemoSession | null = null;

/** Frontend-only access for previewing the workspace. It is not secure authentication. */
export function getDemoSession(): DemoSession | null {
  if (typeof window === 'undefined') return volatileSession;
  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as DemoSession : volatileSession;
  } catch {
    return volatileSession;
  }
}

export function clearDemoSession() {
  volatileSession = null;
  try { window.localStorage.removeItem(SESSION_KEY); } catch { /* storage can be disabled */ }
}

function saveDemoSession(email: string, name?: string) {
  const previous = getDemoSession();
  const localName = name?.trim() || (previous?.email === email ? previous.name : email.split('@')[0] || 'Student');
  volatileSession = { email, name: localName };
  try { window.localStorage.setItem(SESSION_KEY, JSON.stringify(volatileSession)); } catch { /* in-memory preview remains available until this tab closes */ }
}

/** Development adapter only: never stores passwords or sends data to a server. */
export async function mockAuth(action: string, email: string, name?: string): Promise<AuthResult> {
  await new Promise(resolve => setTimeout(resolve, 350));
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, message: 'Enter a valid email address.' };
  if (action === 'register') {
    saveDemoSession(normalizedEmail, name);
    return { ok: true, message: 'Preview profile created. No email was sent; continue to the workspace.' };
  }
  if (action === 'login') {
    saveDemoSession(normalizedEmail);
    return { ok: true, message: 'Preview access ready. No credentials were sent to a server.' };
  }
  if (action === 'forgot') return { ok: true, message: 'Password reset is unavailable in this frontend preview.' };
  return { ok: true, message: 'Password updates require a connected account service.' };
}
