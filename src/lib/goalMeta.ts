export type GoalMeta = {
  category: string; // e.g., productivity, fitness, learning
  isPublic: boolean;
  passwordHash?: string; // sha-256 hex if protected
};

const META_KEY = 'goal_meta_store_v1';
const RECENT_KEY = 'goal_recent_shares_v1';

function readStore(): Record<string, GoalMeta> {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, GoalMeta>) {
  localStorage.setItem(META_KEY, JSON.stringify(store));
}

export function getGoalMeta(id: string): GoalMeta | null {
  const store = readStore();
  return store[id] || null;
}

export function setGoalMeta(id: string, meta: GoalMeta) {
  const store = readStore();
  store[id] = meta;
  writeStore(store);
}

export type RecentShare = {
  id: string;
  title: string;
  url: string;
  timestamp: number;
};

export function pushRecentShare(entry: RecentShare) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list: RecentShare[] = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    const trimmed = list.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function getRecentShares(): RecentShare[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
