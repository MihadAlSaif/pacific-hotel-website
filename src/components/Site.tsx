"use client";

import { MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAvailability, type Availability } from "@/api";
import { addDays, fmtDay, ukToday } from "@/dates";
import { FACILITIES, HOTEL, ROOMS, type Photo, type RoomInfo } from "@/site";
import { EnquiryForm, RequestDialog, type Stay } from "./Forms";
import { Carousel } from "./Carousel";
import { Footer, Header } from "./Chrome";
import { Gallery } from "./Gallery";
import { rememberStay } from "./RoomPage";
import { asset, roomHref } from "@/links";

export function Site() {
  // Dates are set in the browser, not when the site is built, so "today" is always today in the UK.
  const [today, setToday] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  useEffect(() => {
    const t = ukToday();
    setToday(t);
    setStart(addDays(t, 1));
    setEnd(addDays(t, 3));
  }, []);
  const [guests, setGuests] = useState(2);
  const [stay, setStay] = useState<Stay | null>(null);
  const [avail, setAvail] = useState<Availability | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState<RoomInfo | null>(null);
  const [viewing, setViewing] = useState<{ title: string; photos: Photo[]; start: number } | null>(null);
  const closeGallery = useCallback(() => setViewing(null), []);
  const openPhotos = useCallback((r: RoomInfo, start = 0) => r.photos?.length && setViewing({ title: r.name, photos: r.photos, start }), []);
  const searchRef = useRef<HTMLFormElement>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (end <= start) return setError("Check-out must be after check-in.");
    setBusy(true);
    setError(null);
    try {
      const a = await getAvailability(start, end);
      setAvail(a);
      setStay({ start, end, guests });
      rememberStay({ start, end, guests });
      document.getElementById("rooms")?.scrollIntoView({ block: "start" });
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  }

  const focusSearch = useCallback(() => {
    searchRef.current?.scrollIntoView({ block: "center" });
    setTimeout(() => searchRef.current?.querySelector<HTMLInputElement>("input")?.focus(), 300);
  }, []);

  const seaRooms = ROOMS.filter((r) => r.seaView);
  const townRooms = ROOMS.filter((r) => !r.seaView);

  return (
    <MotionConfig reducedMotion="user">
      <Header onHome />

      <main id="top">
        {/* Hero: the name sits on the horizon, where the sea meets the sky. */}
        <section className="relative" aria-labelledby="hotel-name">
          <div className="flex h-[440px] flex-col sm:h-[540px]">
            <div className="gutter flex flex-[62] items-end bg-gradient-to-b from-[#eef6f9] to-sky">
              <div className="mx-auto w-full max-w-[1120px]">
                <motion.p className="mb-3 max-w-[30ch] text-lg text-ink/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                  On the seafront at {HOTEL.town}, one minute from the beach.
                </motion.p>
                <motion.h1 id="hotel-name" className="mb-[-0.19em] text-[clamp(3.4rem,13vw,9.5rem)] leading-none tracking-[-0.02em] text-ink"
                  initial={{ y: "0.35em", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
                  {HOTEL.name}
                </motion.h1>
              </div>
            </div>
            <div className="gutter relative flex-[38] bg-sea"
              style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 13px, rgb(255 255 255 / 0.07) 13px 14px), linear-gradient(to bottom, #2a6377, var(--color-sea))" }}>
              <p className="absolute bottom-16 right-[max(20px,env(safe-area-inset-right,0px))] text-right text-xs text-white/60 sm:bottom-20">Photo of the sea view coming soon</p>
            </div>
          </div>

          {/* Availability search, overlapping the sea. */}
          <div className="gutter relative -mt-12">
            <form ref={searchRef} id="book" onSubmit={search} aria-label="Check availability"
              className="mx-auto grid max-w-[1120px] gap-3 rounded-3xl bg-paper p-4 shadow-[0_12px_40px_-12px_rgb(15_42_61/0.35)] sm:grid-cols-[1fr_1fr_0.7fr_auto] sm:items-end sm:p-5">
              <div className="field">
                <label htmlFor="start">Check-in</label>
                <input id="start" type="date" className="input" min={today || undefined} max={today ? addDays(today, 365) : undefined} value={start} required
                  onChange={(e) => { setStart(e.target.value); if (e.target.value >= end) setEnd(addDays(e.target.value, 1)); }} />
              </div>
              <div className="field">
                <label htmlFor="end">Check-out</label>
                <input id="end" type="date" className="input" min={start ? addDays(start, 1) : undefined} max={start ? addDays(start, 30) : undefined} value={end} required onChange={(e) => setEnd(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="guests">Guests</label>
                <select id="guests" className="input" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                  {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-book h-[46px]" disabled={busy}>{busy ? "Checking…" : "Check availability"}</button>
              {error && <p className="error sm:col-span-4" role="alert">{error}</p>}
            </form>
          </div>
        </section>

        <div className="gutter">
          <div className="mx-auto grid max-w-[1120px] gap-20 pb-20 pt-14 sm:gap-24">
            <ul className="grid gap-x-8 gap-y-2 text-[1.05rem] sm:grid-cols-4" aria-label="At a glance">
              <li><b className="font-semibold">Beachfront.</b> One minute's walk to Clacton Beach.</li>
              <li><b className="font-semibold">Sea views</b> from five of our rooms.</li>
              <li><b className="font-semibold">Free WiFi</b> and streaming TV.</li>
              <li><b className="font-semibold">Easy by train</b> to {HOTEL.town}.</li>
            </ul>

            <section id="rooms" aria-labelledby="rooms-title" className="grid gap-8">
              <div className="grid gap-2">
                <h2 id="rooms-title" className="text-[clamp(2.2rem,5vw,3.4rem)]">Rooms</h2>
                {stay && avail ? (
                  <p className="text-drift">
                    Showing rooms for {fmtDay(stay.start)} to {fmtDay(stay.end)}, {avail.nights} night{avail.nights === 1 ? "" : "s"}, {stay.guests} guest{stay.guests === 1 ? "" : "s"}.{" "}
                    <button type="button" className="font-semibold text-ink underline" onClick={focusSearch}>Change dates</button>
                  </p>
                ) : (
                  <p className="max-w-[60ch] text-drift">Every room has a private bathroom with a walk-in shower. Choose your dates above to see what's free.</p>
                )}
              </div>
              <RoomGroup title="Facing the sea" rooms={seaRooms} avail={avail} stay={stay} onRequest={setRequesting} onCheck={focusSearch} onPhotos={openPhotos} />
              <RoomGroup title="Town side" rooms={townRooms} avail={avail} stay={stay} onRequest={setRequesting} onCheck={focusSearch} onPhotos={openPhotos} />
            </section>

            <section id="stay" aria-labelledby="stay-title" className="grid gap-8 sm:grid-cols-[1fr_1.4fr]">
              <div className="grid content-start gap-3">
                <h2 id="stay-title" className="text-[clamp(2.2rem,5vw,3.4rem)]">Your stay</h2>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[1.05rem]">
                  <dt className="text-drift">Check-in</dt><dd>{HOTEL.checkIn}</dd>
                  <dt className="text-drift">Check-out</dt><dd>{HOTEL.checkOut}</dd>
                </dl>
              </div>
              <ul className="grid content-start gap-x-8 gap-y-3 sm:grid-cols-2">
                {FACILITIES.map((f) => <li key={f} className="border-t border-shore pt-3">{f}</li>)}
              </ul>
            </section>

            <section id="find-us" aria-labelledby="find-title" className="grid gap-8 sm:grid-cols-[1fr_1.4fr]">
              <div className="grid content-start gap-3">
                <h2 id="find-title" className="text-[clamp(2.2rem,5vw,3.4rem)]">Find us</h2>
                <address className="text-[1.15rem] not-italic leading-relaxed">
                  {HOTEL.name}<br />{HOTEL.street}<br />{HOTEL.town}<br />{HOTEL.postcode}
                </address>
                <a className="btn justify-self-start" href={HOTEL.mapsUrl} target="_blank" rel="noopener">Open in Google Maps</a>
              </div>
              <div className="grid content-start gap-4">
                <figure className="grid gap-2">
                  <img src={asset("hotel/balcony-view.jpg")} alt="View from a sea view balcony over Marine Parade East to the sea" className="aspect-[16/9] w-full rounded-3xl object-cover" loading="lazy" />
                  <figcaption className="text-sm text-drift">The view from a sea view balcony.</figcaption>
                </figure>
                <p className="max-w-[60ch]">We're on Marine Parade East, right on the seafront. Trains run to {HOTEL.town} from London Liverpool Street.</p>
              </div>
            </section>

            <section aria-labelledby="sites-title" className="grid gap-4 rounded-3xl bg-sky/70 p-6 sm:grid-cols-[1.4fr_1fr] sm:items-center sm:p-8">
              <div className="grid gap-2">
                <h2 id="sites-title" className="text-[clamp(1.7rem,4vw,2.4rem)]">Prefer to book on a booking site?</h2>
                <p className="max-w-[55ch]">You'll find us on Booking.com{HOTEL.airbnbUrl ? " and Airbnb" : ""}, with guest reviews. It's the same rooms wherever you book.</p>
              </div>
              <div className="flex flex-wrap gap-3 sm:justify-end">
                <a className="btn" href={HOTEL.bookingComUrl} target="_blank" rel="noopener">Booking.com</a>
                {HOTEL.airbnbUrl && <a className="btn" href={HOTEL.airbnbUrl} target="_blank" rel="noopener">Airbnb</a>}
              </div>
            </section>

            <section id="contact" aria-labelledby="contact-title" className="grid gap-8 sm:grid-cols-[1fr_1.4fr]">
              <div className="grid content-start gap-3">
                <h2 id="contact-title" className="text-[clamp(2.2rem,5vw,3.4rem)]">Contact</h2>
                <p className="max-w-[40ch]">Questions about parking, pets, groups or longer stays? Send us a message.</p>
                {HOTEL.phone && <p>Phone <a className="font-semibold underline" href={`tel:${HOTEL.phone.replace(/\s/g, "")}`}>{HOTEL.phone}</a></p>}
                {HOTEL.email && <p>Email <a className="font-semibold underline" href={`mailto:${HOTEL.email}`}>{HOTEL.email}</a></p>}
              </div>
              <EnquiryForm stay={stay} />
            </section>
          </div>
        </div>
      </main>

      <Footer />

      <RequestDialog room={requesting} stay={stay} onClose={() => setRequesting(null)} />
      <Gallery title={viewing?.title ?? ""} photos={viewing?.photos ?? null} start={viewing?.start ?? 0} onClose={closeGallery} />
    </MotionConfig>
  );
}

type RowActions = { onRequest: (r: RoomInfo) => void; onCheck: () => void; onPhotos: (r: RoomInfo, start?: number) => void };

function RoomGroup({ title, rooms, avail, stay, ...act }: { title: string; rooms: RoomInfo[]; avail: Availability | null; stay: Stay | null } & RowActions) {
  return (
    <div className="grid gap-1">
      <h3 className="border-b border-shore pb-2 font-sans text-sm font-semibold text-drift">{title}</h3>
      <ul className="grid">
        {rooms.map((r) => <RoomRow key={r.name} room={r} avail={avail} stay={stay} {...act} />)}
      </ul>
    </div>
  );
}

function RoomRow({ room, avail, stay, onRequest, onCheck, onPhotos }: { room: RoomInfo; avail: Availability | null; stay: Stay | null } & RowActions) {
  const live = avail?.rooms.find((x) => x.name === room.name);
  let status: React.ReactNode;
  if (room.closedNote) status = <p className="text-drift">{room.closedNote}</p>;
  else if (!avail || !stay) status = <button type="button" className="btn" onClick={onCheck}>Check dates</button>;
  else if (!live) status = <p className="text-drift">Ask us about this room for your dates.</p>;
  else if (stay.guests > room.sleeps) status = <p className="text-drift">Sleeps up to {room.sleeps}.</p>;
  else if (live.free === 0) status = <p className="text-drift">Taken for these dates.</p>;
  else
    status = (
      <div className="grid justify-items-start gap-2 sm:justify-items-end">
        <p className="font-semibold text-ok">{live.free === 1 ? "Last one free for your dates" : "Free for your dates"}</p>
        <button type="button" className="btn btn-book" onClick={() => onRequest(room)}>Request to book</button>
      </div>
    );

  return (
    <li className="grid gap-4 border-b border-shore py-6 sm:grid-cols-[260px_1fr_auto] sm:items-start sm:gap-7">
      {room.photos?.length ? (
        <Carousel photos={room.photos} onOpen={(k) => onPhotos(room, k)} label={`${room.name} photos`} className="overflow-hidden rounded-2xl" />
      ) : (
        <div className={`photo-slot ${room.seaView ? "sea" : ""} grid aspect-[4/3] w-full place-items-end rounded-2xl p-2`} role="img" aria-label={`Photos of the ${room.name} coming soon`}>
          <span className="rounded-full bg-paper/80 px-2 py-0.5 text-[0.7rem] text-drift">Photos soon</span>
        </div>
      )}
      <div className="grid min-w-0 content-start gap-2">
        <h4 className="font-display text-[1.45rem] leading-tight">
          {room.description ? <a href={roomHref(room.name)} className="hover:underline">{room.name}</a> : room.name}
        </h4>
        <p className="text-drift">{room.size ? `${room.size} m² · ` : ""}{room.beds} · sleeps {room.sleeps}</p>
        <p className="max-w-[58ch]">{room.blurb}</p>
        {room.highlights && (
          <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Highlights">
            {room.highlights.map((h) => <li key={h.title} className="rounded-full bg-sky/70 px-2.5 py-0.5 text-sm">{h.title}</li>)}
          </ul>
        )}
        {room.description && <a href={roomHref(room.name)} className="mt-1 justify-self-start font-semibold underline underline-offset-4">See room details</a>}
      </div>
      <div className="sm:pt-1 sm:text-right">{status}</div>
    </li>
  );
}
