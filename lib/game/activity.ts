const STORAGE_KEY = "cant-maintain:activity";

/** Map of "YYYY-MM-DD" → number of games completed that day. */
export type ActivityMap = Record<string, number>;

function readActivity(): ActivityMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ActivityMap;
  } catch {
    return {};
  }
}

function writeActivity(map: ActivityMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage full or unavailable
  }
}

/** Format a Date as "YYYY-MM-DD" in local time. */
function toDateKey(d: Date): string {
  return `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Record one completed game for today. */
export function recordActivity() {
  const map = readActivity();
  const key = toDateKey(new Date());
  map[key] = (map[key] ?? 0) + 1;
  writeActivity(map);
}

/** Get the full activity map. */
export function getActivity(): ActivityMap {
  return readActivity();
}

/**
 * Build activity data for the last N weeks ending today.
 * Returns an array of { date, count, dateKey } for each day.
 */
export function getActivityGrid(weeks = 20): {
  date: Date;
  dateKey: string;
  count: number;
}[] {
  const map = readActivity();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // End on Saturday of the current week (so current week is the last column)
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - dayOfWeek));

  const totalDays = weeks * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalDays + 1);

  const grid: { date: Date; dateKey: string; count: number }[] = [];
  const cursor = new Date(startDate);
  for (let i = 0; i < totalDays; i++) {
    const key = toDateKey(cursor);
    grid.push({ date: new Date(cursor), dateKey: key, count: map[key] ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return grid;
}
