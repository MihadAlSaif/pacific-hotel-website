"use client";

import { ChevronLeft, Grid3x3, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { getAvailability } from "@/api";
import { addDays, fmtDay, nightsBetween, ukToday } from "@/dates";
import { asset, homeHref } from "@/links";
import { HOTEL, ROOMS, slugOf, type RoomInfo } from "@/site";
import { Carousel } from "./Carousel";
import { Footer, Header } from "./Chrome";
import { RequestDialog, type Stay } from "./Forms";
import { Gallery } from "./Gallery";
import { Icon } from "./Icon";

/** The dates a guest searched on the home page, so the room page starts with the same ones. */
export const STAY_KEY = "pacific-hotel-stay";
export function rememberStay(stay: Stay) {
  try {
    sessionStorage.setItem(STAY_KEY, JSON.stringify(stay));
  } catch {}
}
function recallStay(): Stay | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(STAY_KEY) ?? "null") as Stay | null;
    return s && s.start >= ukToday() ? s : null;
  } catch {
    return null;
  }
}

/** How many amenities show before "Show all". */
const SHOWN = 10;

export function RoomPage({ slug }: { slug: string }) {
  const room = ROOMS.find((r) => slugOf(r.name) === slug);
  const [gallery, setGallery] = useState<number | null>(null);
  const [allAmenities, setAllAmenities] = useState(false);
  const [requesting, setRequesting] = useState<{ room: RoomInfo; stay: Stay } | null>(null);
  const closeGallery = useCallback(() => setGallery(null), []);

  if (!room)
    return (
      <>
        <Header />
        <main className="gutter mx-auto grid max-w-[1120px] gap-4 py-20">
          <h1 className="text-4xl">Room not found</h1>
          <a className="btn justify-self-start" href={homeHref("rooms")}>See all rooms</a>
        </main>
      </>
    );

  const photos = room.photos ?? [];
  const items = room.amenities?.flatMap((g) => g.items) ?? [];
  const summary = [room.beds, "Private bathroom", room.size ? `${room.size} m²` : "", `Sleeps ${room.sleeps}`].filter(Boolean).join(" · ");

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main className="gutter">
        <div className="mx-auto grid max-w-[1120px] gap-6 pb-20 pt-5">
          <div className="grid gap-2">
            <a href={homeHref("rooms")} className="inline-flex items-center gap-1 justify-self-start text-drift hover:text-ink">
              <ChevronLeft className="size-4" aria-hidden="true" /> All rooms
            </a>
            <h1 className="text-[clamp(2rem,4.5vw,3rem)]">{room.name}</h1>
            <p className="text-drift">{HOTEL.name} · {HOTEL.street}, {HOTEL.town}</p>
          </div>

          {photos.length > 0 && (
            <>
              {/* Phones: swipe through the photos. */}
              <div className="-mx-5 md:hidden">
                <Carousel photos={photos} onOpen={setGallery} label={`${room.name} photos`} imgClassName="aspect-[4/3] w-full object-cover" />
              </div>
              {/* Larger screens: one big photo and four small ones, like the booking sites. */}
              <div className="relative hidden h-[440px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:grid">
                {photos.slice(0, 5).map((p, k) => (
                  <button key={p.src} type="button" onClick={() => setGallery(k)} className={`group overflow-hidden ${k === 0 ? "col-span-2 row-span-2" : ""}`} aria-label={`Open photo ${k + 1}: ${p.alt}`}>
                    <img src={asset(`${p.src}${k === 0 ? "" : "-sm"}.jpg`)} alt={p.alt} className="h-full w-full object-cover transition duration-300 group-hover:brightness-90" />
                  </button>
                ))}
                <button type="button" onClick={() => setGallery(0)} className="btn absolute bottom-4 right-4 gap-2 border-ink/60 py-2 text-sm shadow">
                  <Grid3x3 className="size-4" aria-hidden="true" /> Show all {photos.length} photos
                </button>
              </div>
            </>
          )}

          <div className="grid gap-10 md:grid-cols-[1fr_360px] md:gap-14">
            <div className="grid min-w-0 content-start">
              <section className="grid gap-1 border-b border-shore pb-6">
                <h2 className="font-sans text-xl font-semibold">Room at {HOTEL.name}, {HOTEL.town}</h2>
                <p className="text-drift">{summary}</p>
              </section>

              {room.highlights && (
                <ul className="grid gap-5 border-b border-shore py-7">
                  {room.highlights.map((h) => (
                    <li key={h.title} className="grid grid-cols-[auto_1fr] gap-x-5">
                      <Icon name={h.icon} className="row-span-2 size-7 text-sea" />
                      <b className="font-semibold">{h.title}</b>
                      <span className="text-drift">{h.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {room.description && (
                <section className="grid gap-4 border-b border-shore py-7" aria-label="About this room">
                  {room.description.split("\n\n").map((para) => <p key={para.slice(0, 20)} className="max-w-[62ch]">{para}</p>)}
                </section>
              )}

              {items.length > 0 && (
                <section className="grid gap-5 border-b border-shore py-7" aria-labelledby="offers">
                  <h2 id="offers" className="font-sans text-xl font-semibold">What this room offers</h2>
                  <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {items.slice(0, SHOWN).map((a) => (
                      <li key={a.label} className="flex items-center gap-4"><Icon name={a.icon} className="size-6 shrink-0" />{a.label}</li>
                    ))}
                  </ul>
                  {items.length > SHOWN && (
                    <button type="button" className="btn justify-self-start border-ink/60" onClick={() => setAllAmenities(true)}>Show all {items.length} amenities</button>
                  )}
                </section>
              )}

              <section className="grid gap-3 py-7" aria-labelledby="know">
                <h2 id="know" className="font-sans text-xl font-semibold">Good to know</h2>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                  <dt className="text-drift">Check-in</dt><dd>{HOTEL.checkIn}</dd>
                  <dt className="text-drift">Check-out</dt><dd>{HOTEL.checkOut}</dd>
                </dl>
              </section>
            </div>

            <aside id="book-box" className="scroll-mt-24 md:pt-2">
              <BookingBox room={room} onRequest={(stay) => setRequesting({ room, stay })} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />

      {/* Phones: a bar at the bottom of the screen that jumps to the booking box. */}
      {!room.closedNote && (
        <div className="gutter fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-shore bg-paper py-3 pb-[max(12px,env(safe-area-inset-bottom,0px))] md:hidden">
          <p className="text-sm leading-tight"><b className="font-semibold">Book direct</b><br /><span className="text-drift">Price confirmed by the hotel</span></p>
          <a href="#book-box" className="btn btn-book" onClick={(e) => { e.preventDefault(); document.getElementById("book-box")?.scrollIntoView({ block: "start" }); }}>Check availability</a>
        </div>
      )}
      <div className="h-20 md:hidden" aria-hidden="true" />

      <Gallery title={room.name} photos={gallery === null ? null : photos} start={gallery ?? 0} onClose={closeGallery} />
      <RequestDialog room={requesting?.room ?? null} stay={requesting?.stay ?? null} onClose={() => setRequesting(null)} />
      <AmenitiesDialog room={room} open={allAmenities} onClose={() => setAllAmenities(false)} />
    </MotionConfig>
  );
}

/** Dates, guests and live availability for this one room, with the request button. */
function BookingBox({ room, onRequest }: { room: RoomInfo; onRequest: (stay: Stay) => void }) {
  const [today, setToday] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [guests, setGuests] = useState(Math.min(2, room.sleeps));
  const [result, setResult] = useState<{ stay: Stay; free: number | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = ukToday();
    setToday(t);
    const saved = recallStay();
    setStart(saved?.start ?? addDays(t, 1));
    setEnd(saved?.end ?? addDays(t, 3));
    if (saved) setGuests(Math.min(saved.guests, room.sleeps));
  }, [room.sleeps]);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (end <= start) return setError("Check-out must be after check-in.");
    setBusy(true);
    setError(null);
    try {
      const a = await getAvailability(start, end);
      const stay = { start, end, guests };
      rememberStay(stay);
      setResult({ stay, free: a.rooms.find((r) => r.name === room.name)?.free ?? null });
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  }

  const changed = result && (result.stay.start !== start || result.stay.end !== end || result.stay.guests !== guests);
  const nights = result ? nightsBetween(result.stay.start, result.stay.end) : 0;

  if (room.closedNote)
    return <div className="rounded-3xl border border-shore bg-paper p-6 shadow-[0_8px_30px_-12px_rgb(15_42_61/0.25)]"><p>{room.closedNote}</p></div>;

  return (
    <form onSubmit={check} className="sticky top-24 grid gap-4 rounded-3xl border border-shore bg-paper p-5 shadow-[0_8px_30px_-12px_rgb(15_42_61/0.25)]" aria-label="Check this room">
      <div>
        <p className="font-display text-2xl">Book direct</p>
        <p className="text-sm text-drift">Prices are confirmed by the hotel when you request.</p>
      </div>
      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-ink/30">
        <div className="field border-b border-r border-ink/30 p-2.5">
          <label htmlFor="bb-start" className="text-[0.7rem] font-bold uppercase tracking-wide text-ink">Check-in</label>
          <input id="bb-start" type="date" className="min-w-0 bg-transparent text-[0.95rem]" min={today || undefined} max={today ? addDays(today, 365) : undefined} value={start} required
            onChange={(e) => { setStart(e.target.value); if (e.target.value >= end) setEnd(addDays(e.target.value, 1)); }} />
        </div>
        <div className="field border-b border-ink/30 p-2.5">
          <label htmlFor="bb-end" className="text-[0.7rem] font-bold uppercase tracking-wide text-ink">Check-out</label>
          <input id="bb-end" type="date" className="min-w-0 bg-transparent text-[0.95rem]" min={start ? addDays(start, 1) : undefined} max={start ? addDays(start, 30) : undefined} value={end} required onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className="field col-span-2 p-2.5">
          <label htmlFor="bb-guests" className="text-[0.7rem] font-bold uppercase tracking-wide text-ink">Guests</label>
          <select id="bb-guests" className="bg-transparent text-[0.95rem]" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {Array.from({ length: room.sleeps }, (_, k) => k + 1).map((n) => <option key={n} value={n}>{n} guest{n === 1 ? "" : "s"}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      {result && !changed ? (
        result.free === null ? (
          <p className="note">This room isn't bookable online for these dates. Send us a message and we'll help.</p>
        ) : result.free > 0 ? (
          <div className="grid gap-3" role="status">
            <p className="font-semibold text-ok">Free for {fmtDay(result.stay.start)} to {fmtDay(result.stay.end)}, {nights} night{nights === 1 ? "" : "s"}</p>
            <button type="button" className="btn btn-book w-full py-3 text-[1.05rem]" onClick={() => onRequest(result.stay)}>Request to book</button>
            <p className="text-center text-sm text-drift">You won't be charged. The hotel replies to confirm.</p>
          </div>
        ) : (
          <div className="grid gap-2" role="status">
            <p className="font-semibold text-warn">Taken for these dates.</p>
            <a href={homeHref("rooms")} className="underline">See other rooms</a>
          </div>
        )
      ) : (
        <button type="submit" className="btn btn-book w-full py-3 text-[1.05rem]" disabled={busy}>{busy ? "Checking…" : "Check availability"}</button>
      )}
    </form>
  );
}

function AmenitiesDialog({ room, open, onClose }: { room: RoomInfo; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="all-amenities" className="grid max-h-[90dvh] w-full max-w-[620px] content-start gap-5 overflow-auto rounded-t-3xl bg-paper p-6 pb-[calc(24px+env(safe-area-inset-bottom,0px))] sm:rounded-3xl"
            initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} transition={{ type: "spring", stiffness: 380, damping: 34 }}>
            <div className="flex items-center justify-between">
              <h2 id="all-amenities" className="text-2xl">What this room offers</h2>
              <button type="button" onClick={onClose} aria-label="Close" autoFocus className="grid size-9 place-items-center rounded-full bg-sky"><X className="size-5" /></button>
            </div>
            {room.amenities?.map((g) => (
              <section key={g.title} className="grid gap-3">
                <h3 className="font-sans text-lg font-semibold">{g.title}</h3>
                <ul className="grid">
                  {g.items.map((a) => (
                    <li key={a.label} className="flex items-center gap-4 border-b border-shore py-3 last:border-0"><Icon name={a.icon} className="size-6 shrink-0" />{a.label}</li>
                  ))}
                </ul>
              </section>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
