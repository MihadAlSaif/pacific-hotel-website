// Preview build: the real website with sample availability instead of BedSync, as one page.
// Room pages are shown with #room-<name> links instead of separate addresses.
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { RoomPage } from "@/components/RoomPage";
import { Site } from "@/components/Site";

function Preview() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  const room = hash.startsWith("#room-") ? hash.slice(6) : null;
  useEffect(() => {
    // After switching views, go to the section the link pointed at, or the top.
    const el = !room && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (el) el.scrollIntoView();
    else scrollTo(0, 0);
  }, [hash, room]);
  return room ? <RoomPage key={room} slug={room} /> : <Site />;
}

createRoot(document.getElementById("root")!).render(<Preview />);
