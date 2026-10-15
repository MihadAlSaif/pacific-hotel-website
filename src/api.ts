import { BEDSYNC_URL, ROOMS } from "./site";

export interface Availability {
  start: string;
  end: string;
  nights: number;
  rooms: { name: string; details: string; capacity: number; free: number }[];
}

export interface RequestBody {
  kind: "stay" | "enquiry";
  roomName?: string;
  start?: string | null;
  end?: string | null;
  guests?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
  elapsed: number;
}

/** The preview page has no BedSync to talk to, so it answers with sample data. */
const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BEDSYNC_URL + path, { ...init, headers: { "Content-Type": "application/json" }, cache: "no-store" });
  } catch {
    throw new Error("Couldn't reach the booking system. Check your connection and try again, or contact the hotel.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Something went wrong. Please try again or contact the hotel.");
  return data as T;
}

export function getAvailability(start: string, end: string): Promise<Availability> {
  if (DEMO) {
    const nights = Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000);
    const free: Record<string, number> = { "King Room with Sea View": 2, "Deluxe Double Room with Sea View": 1, "Double Room": 1, "Standard Single Room with Shower": 2, "Family Room": 1, "Triple Room with Shower": 0, "Super King Room with Sea View": 0, "Budget Double Room": 1 };
    return wait({ start, end, nights, rooms: ROOMS.filter((r) => !r.closedNote).map((r) => ({ name: r.name, details: r.beds, capacity: r.sleeps, free: free[r.name] ?? 0 })) });
  }
  return call(`/api/public/availability?start=${start}&end=${end}`);
}

export function sendRequest(body: RequestBody): Promise<{ ok: true; id: string }> {
  if (DEMO) return wait({ ok: true as const, id: "demo" });
  return call("/api/public/requests", { method: "POST", body: JSON.stringify(body) });
}

const wait = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 450));
