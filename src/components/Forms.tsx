"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { sendRequest } from "@/api";
import { fmtDay, nightsBetween } from "@/dates";
import { HOTEL, type RoomInfo } from "@/site";

/** Hidden from people, tempting to spam bots. Must stay empty. */
function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor="website-field">Leave this empty</label>
      <input id="website-field" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function ContactFields({ idPrefix, messageLabel, messageRequired }: { idPrefix: string; messageLabel: string; messageRequired?: boolean }) {
  return (
    <>
      <div className="field">
        <label htmlFor={`${idPrefix}-name`}>Your name</label>
        <input id={`${idPrefix}-name`} name="name" required autoComplete="name" className="input" maxLength={80} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${idPrefix}-email`}>Email</label>
          <input id={`${idPrefix}-email`} name="email" type="email" required autoComplete="email" className="input" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-phone`}>Phone (optional)</label>
          <input id={`${idPrefix}-phone`} name="phone" type="tel" autoComplete="tel" className="input" maxLength={40} />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-message`}>{messageLabel}</label>
        <textarea id={`${idPrefix}-message`} name="message" rows={3} required={messageRequired} className="input resize-y" maxLength={1000} />
      </div>
      <Honeypot />
    </>
  );
}

const read = (form: HTMLFormElement) => {
  const f = new FormData(form);
  const s = (k: string) => String(f.get(k) ?? "").trim();
  return { name: s("name"), email: s("email"), phone: s("phone"), message: s("message"), website: s("website") };
};

export interface Stay {
  start: string;
  end: string;
  guests: number;
}

/** The panel that opens when a guest asks to book a free room. */
export function RequestDialog({ room, stay, onClose }: { room: RoomInfo | null; stay: Stay | null; onClose: () => void }) {
  const opened = useRef(Date.now());
  const panel = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const open = !!room && !!stay;

  useEffect(() => {
    if (!open) return;
    opened.current = Date.now();
    setSent(false);
    setError(null);
    setBusy(false);
    const last = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    setTimeout(() => panel.current?.querySelector<HTMLElement>("input")?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      last?.focus?.();
    };
  }, [open, onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!room || !stay) return;
    setBusy(true);
    setError(null);
    try {
      await sendRequest({ kind: "stay", roomName: room.name, start: stay.start, end: stay.end, guests: stay.guests, ...read(e.currentTarget), elapsed: Date.now() - opened.current });
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  }

  const nights = stay ? nightsBetween(stay.start, stay.end) : 0;
  return (
    <AnimatePresence>
      {room && stay && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="req-title"
            className="grid max-h-[92dvh] w-full max-w-[520px] gap-4 overflow-auto rounded-t-3xl bg-paper p-5 pb-[calc(24px+env(safe-area-inset-bottom,0px))] sm:rounded-3xl sm:p-7"
            initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} transition={{ type: "spring", stiffness: 380, damping: 34 }}>
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <h2 id="req-title" className="text-2xl">{sent ? "Request sent" : `Request the ${room.name}`}</h2>
                <p className="text-drift">{fmtDay(stay.start)} to {fmtDay(stay.end)} · {nights} night{nights === 1 ? "" : "s"} · {stay.guests} guest{stay.guests === 1 ? "" : "s"}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 shrink-0 place-items-center rounded-full bg-sky text-xl">×</button>
            </div>

            {sent ? (
              <div className="grid gap-4">
                <p>Thank you. The room is not booked yet: {HOTEL.name} will check your request and reply by email{HOTEL.phone ? " or phone" : ""} to confirm the price and your booking.</p>
                <p className="text-drift">Nothing has been charged.</p>
                <button type="button" className="btn justify-self-start" onClick={onClose}>Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="relative grid gap-3">
                <p className="note">This is a request, not a confirmed booking. Nothing is charged now. The hotel replies with the price and confirms.</p>
                <ContactFields idPrefix="req" messageLabel="Anything we should know? (optional)" />
                {error && <p className="error" role="alert">{error}</p>}
                <button type="submit" className="btn btn-book justify-self-start" disabled={busy}>{busy ? "Sending…" : "Send booking request"}</button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** General questions: parking, dogs, group stays, long stays. */
export function EnquiryForm({ stay }: { stay: Stay | null }) {
  const opened = useRef(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    opened.current = Date.now();
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError(null);
    try {
      await sendRequest({ kind: "enquiry", start: stay?.start ?? null, end: stay?.end ?? null, guests: stay?.guests ?? 1, ...read(form), elapsed: Date.now() - opened.current });
      form.reset();
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  }

  if (sent)
    return (
      <div className="grid gap-3 rounded-3xl bg-paper p-6" role="status">
        <h3 className="text-2xl">Message sent</h3>
        <p>Thanks. We'll reply by email as soon as we can.</p>
        <button type="button" className="btn justify-self-start" onClick={() => setSent(false)}>Send another message</button>
      </div>
    );

  return (
    <form onSubmit={submit} className="relative grid gap-3 rounded-3xl bg-paper p-5 sm:p-6">
      {stay && <p className="text-sm text-drift">We'll include your dates: {fmtDay(stay.start)} to {fmtDay(stay.end)}.</p>}
      <ContactFields idPrefix="enq" messageLabel="Your message" messageRequired />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" className="btn justify-self-start" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
    </form>
  );
}
